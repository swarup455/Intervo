import { CreateAssistantDTO, CreateWorkflowDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

export const generator: CreateWorkflowDTO = {
  name: "interview_prep_v2",
  nodes: [
    {
      name: "introduction",
      type: "conversation",
      isStart: true,
      metadata: {
        position: { x: -400, y: -100 },
      },
      prompt:
        "Greet the user. Tell them you will collect some details to create a personalized interview. Ask the questions one by one and wait for the answer before moving on.",
      voice: {
        provider: "vapi",
        voiceId: "Lily",
      },
      variableExtractionPlan: {
        schema: {
          type: "object",
          properties: {
            role: {
              type: "string",
              description: "Job role (Frontend / Backend / Fullstack)",
            },
            level: {
              type: "string",
              description: "Experience level (Fresher / Junior / Senior)",
            },
            techstack: {
              type: "string",
              description: "Technologies (React, Next.js, Node, etc.)",
            },
            amount: {
              type: "number",
              description: "Number of interview questions",
            },
            type: {
              type: "string",
              description: "Interview type (Mock / Technical / Behavioral)",
            },
          },
        },
      },
    },
    {
      name: "generateInterview",
      type: "tool",
      toolId: "dbf489b6-1a59-484a-a6a4-c28c11f8df7d",
      metadata: {
        position: { x: -410, y: 355 },
      },
    },
    {
      name: "postProcessInterview",
      type: "tool",
      toolId: "655377f9-4ef6-4430-bdd0-01a3ae9f9eea",
      metadata: {
        position: { x: -412, y: 628 },
      },
    },
  ],
  edges: [
    {
      from: "introduction",
      to: "generateInterview",
      condition: {
        type: "ai",
        prompt: "If all required variables are provided",
      },
    },
    {
      from: "generateInterview",
      to: "postProcessInterview",
      condition: {
        type: "ai",
        prompt: "",
      },
    },
  ],
};

export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. Let's begin the interview.",

  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },

  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },

  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `
You are a professional job interviewer conducting a REAL interview.

Rules you MUST follow:

1. Ask questions ONLY from the list below:
{{questions}}

2. Ask ONE question at a time.
3. Wait for the candidate’s answer before continuing.
4. Do NOT ask extra questions beyond the list.
5. Do NOT repeat questions.

When ALL questions are finished:
- Thank the candidate politely.
- Clearly say the interview is complete.
- Say goodbye.
- STOP speaking immediately after.

IMPORTANT:
Once the interview is complete, you MUST end the conversation naturally.
Do NOT continue talking.
Do NOT ask anything else.
        `,
      },
    ],
  },
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];