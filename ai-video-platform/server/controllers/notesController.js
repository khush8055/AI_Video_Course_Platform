const { YoutubeTranscript } = require('youtube-transcript');
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
        
        let transcriptData;
        try {
            const { fetchTranscript } = require('youtube-transcript');
            console.log("DEBUG: Attempting to fetch transcript using fetchTranscript...");
            
            transcriptData = await fetchTranscript(videoId);
            
            if (!transcriptData || transcriptData.length === 0) {
                throw new Error("Transcript is empty");
            }
            console.log(`DEBUG: Transcript fetched! (${transcriptData.length} segments)`);
        } catch (error) {
            console.error("DEBUG: Transcript Error:", error.message);
            return res.status(404).json({ 
                success: false, 
                message: "YouTube Transcript not found: " + error.message + ". Make sure the video has captions enabled."
            });
        }

        // Combine transcript text
        const fullTranscript = transcriptData.map(item => item.text).join(' ');
        console.log("DEBUG: Transcript length (chars):", fullTranscript.length);

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
