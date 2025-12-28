# Intervo

Intervo is a production-grade AI mock interview platform designed to provide high-fidelity, real-time voice assessments for technical and behavioral roles. By integrating low-latency voice AI with structured LLM evaluation, it simulates the actual interview experience and provides actionable, data-driven feedback.

**Live Demo:** [https://intervo-psi.vercel.app](https://intervo-psi.vercel.app)

---

## System Overview

Intervo orchestrates three primary layers: **Voice Interaction**, **State Management**, and **Evaluation Logic**. Unlike traditional chat-based mock interviews, Intervo focuses on verbal communication, capturing the nuances of a candidate's speech and technical accuracy in real-time.

### Core Workflow

1.  **Configuration:** The user defines the job role, tech stack, experience level, interview type, and question count. These parameters are injected into a Vapi AI workflow, which dynamically generates the interview structure and customizes the agent's behavior.
2.  **Voice Session:** The platform establishes a WebRTC connection via Vapi AI. The agent conducts the interview by vocally asking the generated questions and adapting to user responses in real-time.
3.  **Transcription & Capture:** Live transcripts are streamed and stored. Once the call ends, the full conversation history is sent to the evaluation engine.
4.  **Structured Evaluation:** The transcript is processed by Groq (running Llama 3 models) to generate a granular report.
5.  **Validation & Persistence:** Evaluation data is validated against a strict Zod schema before being persisted to Firestore for user review.

---

## Technical Decisions

### 1. Real-Time Voice Pipeline (Vapi AI)
We chose Vapi to handle the heavy lifting of STT (Speech-to-Text) and TTS (Text-to-Speech). This ensures sub-second latency, which is critical for natural conversation flow. The agent is configured with specific "functions" to recognize when an interview has concluded, triggering the feedback loop.

### 2. Schema-Validated Feedback (Groq + Zod)
To prevent malformed JSON in feedback reports, we utilize Groq for high-throughput inference wrapped in a **Zod** schema. If the AI's response does not match our defined `InterviewFeedback` interface, the system executes a retry logic, ensuring the UI remains stable and data-consistent.

### 3. Database & Security
**Firebase** provides both the authentication layer and the real-time document store.
* **Firestore:** Used for storing user profiles and interview history. 
* **Security Rules:** Granular Firestore rules ensure that users can only read/write their own interview data, preventing unauthorized cross-tenant access.

### 4. UI/UX (shadcn/ui + Tailwind)
The frontend is built on **Next.js (App Router)**. We prioritized a clean, distraction-free interface to keep the focus on the interview performance. Components are built using **shadcn/ui** for accessibility and professional aesthetic.

---

## Data Flow: Interview to Analytics

The transition from a raw audio stream to a structured dashboard follows a strict data pipeline:

1.  **Post-Call Hook:** Vapi sends a webhook containing the full transcript upon call termination.
2.  **Extraction:** An Edge Function extracts the relevant dialogue turns between the interviewer and the candidate.
3.  **Analysis:** The transcript is sent to the evaluation prompt to generate:
    * **Scoring:** 1–10 scale across technical depth, communication, and soft skills.
    * **Insights:** Identifying specific strengths and pinpointing exact areas for improvement.
4.  **Hydration:** The validated JSON is stored in Firestore under the user's `interviewId`.

---

## Environment Variables

To run this project locally, create a `.env.local` file with the following keys:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# Vapi Voice AI
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_public_key
VAPI_SECRET_TOKEN=your_secret_token

# Evaluation Engine
GROQ_API_KEY=your_groq_key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000