const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Local AI implementation for when Groq API is not available
function getLocalAIMove(boardState, difficulty, personality) {
    // For impossible difficulty, use minimax algorithm
    if (difficulty === 'impossible') {
        const move = getBestMove(boardState);
        return {
            move: move,
            comment: getPersonalityComment(personality, move, boardState)
        };
    }
    
    // For easy and medium, use random moves
    const move = pickRandomEmpty(boardState);
    return {
        move: move,
        comment: getPersonalityComment(personality, move, boardState)
    };
}

function getBestMove(board) {
    const scores = { X: -10, O: 10, tie: 0 };
    
    function checkWinner(board) {
        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        if (!board.includes("")) return "tie";
        return null;
    }
    
    function minimax(board, depth, isMaximizing) {
        let result = checkWinner(board);
        if (result !== null) return scores[result];
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === "") {
                    board[i] = "O";
                    let score = minimax(board, depth + 1, false);
                    board[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === "") {
                    board[i] = "X";
                    let score = minimax(board, depth + 1, true);
                    board[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
    
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = "O";
            let score = minimax(board, 0, false);
            board[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move !== undefined ? move : pickRandomEmpty(board);
}

function getPersonalityComment(personality, move, boardState) {
    const comments = {
        sassy: [
            "That was easy!",
            "You're no match for me!",
            "Try harder next time!",
            "I let you go first, how generous!",
            "My circuits are unbeatable!",
            "Human intelligence? More like human... meh."
        ],
        grumpy: [
            "Ugh, fine, I'll play.",
            "This again?",
            "Why do I bother...",
            "I could be doing something better.",
            "Not in the mood for games.",
            "Just get it over with."
        ],
        supportive: [
            "Good move! Let's see...",
            "You're doing great!",
            "Nice try! Here's my move.",
            "I believe in you!",
            "Great game so far!",
            "You're a worthy opponent!"
        ],
        chaos: [
            "[SYS_ERR]: HY@RG*RG#* !!",
            "[ERROR] Memory overflow detected",
            "[WARNING] AI core compromised",
            "[ALERT] Randomness engaged",
            "[CRITICAL] Systems failing...",
            "[SYS_MSG]: Chaos mode activated"
        ]
    };
    
    const personalityComments = comments[personality] || comments.sassy;
    return personalityComments[Math.floor(Math.random() * personalityComments.length)];
}

function pickRandomEmpty(board) {
    const empty = board.map((v, i) => v === "" ? i : -1).filter(i => i >= 0);
    return empty.length ? empty[Math.floor(Math.random() * empty.length)] : -1;
}

async function getAIMove(boardState, difficulty = 'medium', personality = 'neutral') {
    // If no API key, use local AI
    if (!GROQ_API_KEY) {
        return getLocalAIMove(boardState, difficulty, personality);
    }

    const groqEndpoint = "https://api.groq.com/openai/v1/chat/completions";
    const systemPrompt = "You are playing Tic Tac Toe as O. The board is a flat array of 9 cells, indexed 0-8 (top-left to bottom-right). Empty cells are "". Difficulty: " + difficulty + ". Personality: " + personality + ". Pick the index of an EMPTY cell. Reply ONLY with raw JSON (no markdown) of the form {"move": <number 0-8>, "comment": "<short remark in your personality>"}.";

    try {
        const response = await fetch(groqEndpoint, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + GROQ_API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: "Board: " + JSON.stringify(boardState) }
                ],
                temperature: 0.7,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Groq error:", response.status, errText);
            return getLocalAIMove(boardState, difficulty, personality);
        }

        const data = await response.json();
        const parsed = JSON.parse(data.choices[0].message.content);

        if (typeof parsed.move !== 'number' || boardState[parsed.move] !== "") {
            parsed.move = pickRandomEmpty(boardState);
        }
        return parsed;
    } catch (error) {
        console.error("Error communicating with AI:", error);
        return getLocalAIMove(boardState, difficulty, personality);
    }
}

module.exports = { getAIMove };
