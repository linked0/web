const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function askGemini(prompt: string, apiKey: string) {
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: `You are a helpful solar system guide. Give concise, interesting facts about planets. If the user asks about a specific planet, your response must trigger an animation. Current query: ${prompt}`
                            }
                        ]
                    }
                ]
            }),
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "I'm having trouble connecting to the cosmos right now. Let's try again in a moment.";
    }
}
