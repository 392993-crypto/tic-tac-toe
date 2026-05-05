const express = require('express');
const { getAIMove } = require('../lib/ai');

const router = express.Router();

router.post('/api/ai', async (req, res) => {
    try {
        const { board, difficulty, personality, suggestedMove } = req.body;
        if (!Array.isArray(board) || board.length !== 9) {
            return res.status(400).json({ message: 'board must be an array of 9 cells' });
        }
        const result = await getAIMove(board, difficulty, personality, suggestedMove);
        res.json(result);
    } catch (error) {
        console.error('AI route error:', error);
        // Fallback to a simple random move if there's an error
        const emptyIndices = [];
        for (let i = 0; i < 9; i++) {
            if (!req.body.board || req.body.board[i] === '') {
                emptyIndices.push(i);
            }
        }
        const randomMove = emptyIndices.length > 0 
            ? emptyIndices[Math.floor(Math.random() * emptyIndices.length)] 
            : 0;
        res.json({
            move: randomMove,
            comment: "AI is thinking..."
        });
    }
});

module.exports = router;
