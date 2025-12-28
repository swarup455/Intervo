// app/api/test-feedback/route.ts
import { NextResponse } from "next/server";
import { createFeedback } from "@/lib/actions/general.action";
import { db } from "@/firebase/admin";

export async function GET() {
    const interviewId = "test_interview_id";
    const userId = "test_user_id";

    // 1️⃣ Ensure interview document exists
    await db.collection("interviews").doc(interviewId).set(
        {
            userId,
            role: "Test Role",
            type: "Mock",
            finalized: false,
            createdAt: new Date().toISOString(),
        },
        { merge: true } // safe if it already exists
    );

    // 2️⃣ Mock transcript
    const mockTranscript = [
        { role: "assistant", content: "Tell me about yourself." },
        { role: "user", content: "I am a final-year CS student with React experience." },
        { role: "assistant", content: "Explain useEffect in React." },
        { role: "user", content: "It runs side effects after render and supports cleanup." },
    ];

    // 3️⃣ Generate feedback
    const result = await createFeedback({
        interviewId,
        userId,
        transcript: mockTranscript,
    });

    return NextResponse.json(result);
}