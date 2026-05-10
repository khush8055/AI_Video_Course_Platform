const { generateAIContent } = require('../services/geminiService');

/**
 * Extracts Video ID from various YouTube URL formats
 */
const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

exports.generateNotes = async (req, res) => {
    try {
        const { videoUrl } = req.body;

        if (!videoUrl) {
            return res.status(400).json({ success: false, message: "YouTube URL is required" });
        }

        const videoId = extractVideoId(videoUrl);
        if (!videoId) {
            console.error("DEBUG: Invalid URL received:", videoUrl);
            return res.status(400).json({ success: false, message: "Invalid YouTube URL" });
        }

        console.log(`DEBUG: Starting process for videoId: ${videoId}`);
        
        let fullTranscript = "";
        try {
            console.log("DEBUG: Attempting to fetch transcript using RapidAPI (Youtube Transcriptor)...");
            
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || '5cc8644c0cmsh3b8545ed5414f65p16e75ejsnb96f671456de',
                    'X-RapidAPI-Host': 'youtube-transcriptor.p.rapidapi.com'
                }
            };
            
            let data;
            let responseOk = false;
            let lastErrorMsg = "";
            const langOptions = ['', 'en', 'hi', 'a.en']; // Try no lang, English, Hindi, Auto-English

            for (const lang of langOptions) {
                const langParam = lang ? `&lang=${lang}` : '';
                const url = `https://youtube-transcriptor.p.rapidapi.com/transcript?video_id=${videoId}${langParam}`;
                console.log(`DEBUG: Trying URL: ${url}`);
                
                const response = await fetch(url, options);
                
                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                        throw new Error(`API returned status ${response.status} - Please check RapidAPI Subscription`);
                    }
                    continue; // Try next language
                }
                
                data = await response.json();
                
                if (data.message && data.message.includes("not available")) {
                    lastErrorMsg = data.message;
                    continue; // Try next language
                }
                if (data.error && data.error.includes("not available")) {
                    lastErrorMsg = data.error;
                    continue;
                }

                // If we get here, we have valid data!
                responseOk = true;
                break;
            }

            if (!responseOk || !data) {
                throw new Error(lastErrorMsg || "Could not fetch transcript in any supported language.");
            }
            
            console.log("DEBUG: RapidAPI response received successfully.");

            // Handle different possible JSON structures from the API
            let transcriptArray = [];
            if (Array.isArray(data)) {
                transcriptArray = data;
                if (data.length > 0 && data[0].transcriptionAsText) fullTranscript = data[0].transcriptionAsText;
            } else if (data.transcript && Array.isArray(data.transcript)) {
                transcriptArray = data.transcript;
            } else if (data.transcripts && Array.isArray(data.transcripts)) {
                transcriptArray = data.transcripts;
            } else if (data.data && Array.isArray(data.data)) {
                transcriptArray = data.data;
            } else if (typeof data === 'string') {
                fullTranscript = data;
            } else if (data.text) {
                fullTranscript = data.text;
            } else if (data.transcription) {
                fullTranscript = data.transcription;
            } else if (data.message) {
                throw new Error("RapidAPI Error: " + data.message);
            } else if (data.error) {
                throw new Error("RapidAPI Error: " + data.error);
            } else {
                // If it's a completely unknown object but has keys, let's just dump it so the user can see it
                throw new Error("API Response format unknown. Raw: " + JSON.stringify(data).substring(0, 150));
            }

            // Combine transcript text if it's an array
            if (!fullTranscript && transcriptArray.length > 0) {
                // Try to handle objects with 'text' or just string elements
                fullTranscript = transcriptArray.map(item => {
                    if (typeof item === 'string') return item;
                    if (item && item.text) return item.text;
                    if (item && item.subtitle) return item.subtitle;
                    return JSON.stringify(item); // Fallback: just dump the object
                }).join(' ').trim();
            }

            if (!fullTranscript || fullTranscript.length === 0) {
                throw new Error("Transcript is empty. Raw API data: " + JSON.stringify(data).substring(0, 150));
            }
            
            console.log(`DEBUG: Transcript fetched successfully! Length (chars):`, fullTranscript.length);
        } catch (error) {
            console.error("DEBUG: Transcript Error:", error.message);
            return res.status(404).json({ 
                success: false, 
                message: "YouTube Transcript not found: " + error.message + ". Make sure the video has captions enabled."
            });
        }

        // Send to Gemini for processing
        try {
            console.log("DEBUG: Calling Gemini AI...");
            const aiResponse = await generateAIContent(fullTranscript);
            console.log("DEBUG: AI Response received successfully!");

            return res.status(200).json({
                success: true,
                data: aiResponse
            });
        } catch (aiError) {
            console.error("DEBUG: AI Error:", aiError.message);
            return res.status(500).json({ 
                success: false, 
                message: "AI Generation Error: " + aiError.message 
            });
        }

    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to generate notes", 
            error: error.message 
        });
    }
};
