const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Use the API key from .env (never hardcode secrets in source code)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates structured content from transcript using Gemini AI (Gemini 3 Flash Preview)
 */
exports.generateAIContent = async (transcript) => {
    try {
        // Use gemini-3-flash-preview as requested
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        
        console.log("DEBUG: Calling Gemini 3 Flash Preview via Official SDK...");
        
        const promptText = `
        You are an expert educational content creator. I will provide you with a video transcript.
        Your task is to:
        1. Clean up the subtitles (fix grammar, punctuation, and remove filler words).
        2. Create a short, engaging summary (2-3 sentences).
        3. Create detailed bullet point notes covering all main topics.
        4. List key learning points/takeaways.

        CRITICAL: All generated content MUST be in English, even if the input transcript is in another language (like Hindi).

        Return the response ONLY as a valid JSON object with the following structure:
        {
          "subtitles": "cleaned transcript text (STRICTLY IN ENGLISH)",
          "summary": "short summary (STRICTLY IN ENGLISH)",
          "notes": ["note 1", "note 2", ... (STRICTLY IN ENGLISH)],
          "keyPoints": ["point 1", "point 2", ... (STRICTLY IN ENGLISH)]
        }

        Transcript:
        ${transcript}
        `;

        const result = await model.generateContent(promptText);
        const response = await result.response;
        const text = response.text();
        
        console.log("DEBUG: AI Response received successfully.");

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch (parseError) {
                console.error("DEBUG: JSON Parse Error:", parseError);
                throw new Error("AI returned invalid JSON format");
            }
        }

        throw new Error("No JSON found in AI response");

    } catch (error) {
        console.error("DEBUG: Gemini AI Error:", error.message);
        throw new Error(`AI Generation failed: ${error.message}`);
    }
};
