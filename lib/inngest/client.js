import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "assistai", name: "assistai", 
    credentials : {
        gemeni : {
            apiKey: process.env.GEMINI_API_KEY,
        }
    }
 });
