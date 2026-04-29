const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function getAIMove(boardState, difficulty = 'medium', personality = 'neutral') {
    if (!GROQ_API_KEY) {
        return { move: pickRandomEmpty(boardState), comment: "AI offline (no API key configured)." };
    }

    const groqEndpoint = "https://api.groq.com/openai/v1/chat/completions";
    const systemPrompt = `You are playing Tic Tac Toe as 'O'. The board is a flat array of 9 cells, indexed 0-8 (top-left to bottom-right). Empty cells are "". Difficulty: ${difficulty}. Personality: ${personality}. Pick the index of an EMPTY cell. Reply ONLY with raw JSON (no markdown) of the form {"move": <number 0-8>, "comment": "<short remark in your personality>"}.`;

    try {
        const response = await fetch(groqEndpoint, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Board: ${JSON.stringify(boardState)}` }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Groq error:", response.status, errText);
            return { move: pickRandomEmpty(boardState), comment: "AI hiccup, played randomly." };
        }

        const data = await response.json();
        const parsed = JSON.parse(data.choices[0].message.content);

        if (typeof parsed.move !== 'number' || boardState[parsed.move] !== "") {
            parsed.move = pickRandomEmpty(boardState);
        }
        return parsed;
    } catch (error) {
        console.error("Error communicating with AI:", error);
        return { move: pickRandomEmpty(boardState), comment: "I seem to have short-circuited." };
    }
}

function pickRandomEmpty(board) {
    const empty = board.map((v, i) => v === "" ? i : -1).filter(i => i >= 0);
    return empty.length ? empty[Math.floor(Math.random() * empty.length)] : -1;
}

module.exports = { getAIMove };
