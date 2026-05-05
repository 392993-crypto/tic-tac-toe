const express = require('express');
const { getAIMove } = require('../lib/ai');

const router = express.Router();

router.post('/api/ai', async (req, res) => {
    const { board, difficulty, personality, suggestedMove } = req.body;
    if (!Array.isArray(board) || board.length !== 9) {
        return res.status(400).json({ message: 'board must be an array of 9 cells' });
    }
    const result = await getAIMove(board, difficulty, personality, suggestedMove);
    res.json(result);
});

module.exports = router;
