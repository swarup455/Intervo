'use server'

import { groq } from "@ai-sdk/groq";
import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { generateObject } from "ai";
import z from "zod";

type FeedbackResult = z.infer<typeof feedbackSchema>;

export async function getInterviewsByUserId(userId: string): Promise<Interview[] | null> {
    const interviews = await db.collection('interviews')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
}

export async function getLatestInterviews(params: GetLatestInterviewsParams): Promise<Interview[] | null> {
    const { userId, limit = 20 } = params;

    const interviews = await db.collection('interviews')
        .orderBy('createdAt', 'desc')
        .where('finalized', '==', true)
        .where('userId', '!=', userId)
        .limit(limit)
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
}

export async function getInterviewById(id: string): Promise<Interview | null> {
    const interviews = await db.collection('interviews')
        .doc(id)
        .get();

    return interviews.data() as Interview | null;
}

export async function createFeedback(params: CreateFeedbackParams) {
    const { interviewId, userId, transcript, feedbackId } = params;

    try {
        if (!transcript || transcript.length < 2) {
            throw new Error("Transcript too short to generate feedback");
        }

        const formattedTranscript = transcript
            .map(
                (sentence: { role: string; content: string }) =>
                    `- ${sentence.role}: ${sentence.content}`
            )
            .join("\n");

        const { object } = await generateObject<FeedbackResult>({
            model: groq("llama-3.3-70b-versatile"),
            schema: feedbackSchema,
            prompt: `
            You MUST return a JSON object that EXACTLY matches this structure:

            {
              "totalScore": number,
              "categoryScores": [
                { "name": "Communication Skills", "score": number, "comment": string },
                { "name": "Technical Knowledge", "score": number, "comment": string },
                { "name": "Problem Solving", "score": number, "comment": string },
                { "name": "Cultural Fit", "score": number, "comment": string },
                { "name": "Confidence and Clarity", "score": number, "comment": string }
              ],
              "strengths": string[],
              "areasForImprovement": string[],
              "finalAssessment": string
            }

            DO NOT change field names.
            DO NOT add extra fields.
            DO NOT nest objects.
            DO NOT explain outside JSON.

            Transcript:
            ${formattedTranscript}
            `,
        });

        if (!object) {
            throw new Error("Groq returned empty feedback object");
        }
        const sumOfScores = object.categoryScores.reduce(
            (sum, c) => sum + c.score,
            0
        );
        const totalScore = Math.round((sumOfScores / 25) * 100);

        const feedback = {
            interviewId,
            userId,
            totalScore,
            categoryScores: object.categoryScores,
            strengths: object.strengths,
            areasForImprovement: object.areasForImprovement,
            finalAssessment: object.finalAssessment,
            createdAt: new Date().toISOString(),
        };

        const feedbackRef = feedbackId
            ? db.collection("feedback").doc(feedbackId)
            : db.collection("feedback").doc();

        await feedbackRef.set(feedback);

        const interviewRef = db.collection("interviews").doc(interviewId);
        const snap = await interviewRef.get();

        if (snap.exists) {
            await interviewRef.update({
                finalized: true,
                completedAt: new Date().toISOString(),
            });
        }
        return { success: true, feedbackId: feedbackRef.id };
    } catch (error) {
        console.error("Error saving feedback:", error);
        return { success: false };
    }
}

export async function getFeedbackByInterviewId(params: GetFeedbackByInterviewIdParams): Promise<Feedback | null> {
    const { interviewId, userId } = params;

    const feedback = await db.collection('feedback')
        .where('interviewId', '==', interviewId)
        .where('userId', '==', userId)
        .limit(1)
        .get();

    if (feedback.empty) return null;

    const feedbackDoc = feedback.docs[0];
    return {
        id: feedbackDoc.id,
        ...feedbackDoc.data()
    } as Feedback;
}