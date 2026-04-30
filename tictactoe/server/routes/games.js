const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const gamesFilePath = path.join(__dirname, '../data/games.json');

function readGames() {
    if (!fs.existsSync(gamesFilePath)) return [];
    const raw = fs.readFileSync(gamesFilePath, 'utf8');
    return raw ? JSON.parse(raw) : [];
}

function writeGames(games) {
    fs.writeFileSync(gamesFilePath, JSON.stringify(games, null, 2));
}

// Save a finished game
router.post('/api/games/save', (req, res) => {
    const { board, winner, mode, difficulty, personality, username } = req.body || {};

    if (!Array.isArray(board) || board.length !== 9) {
        return res.status(400).json({ success: false, message: 'board must be an array of 9 cells' });
    }
    if (!mode) {
        return res.status(400).json({ success: false, message: 'mode is required' });
    }

    const games = readGames();
    const game = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        board,
        winner: winner || 'draw',
        mode,
        difficulty: difficulty || null,
        personality: personality || null,
        username: username || null,
        finishedAt: new Date().toISOString(),
    };
    games.push(game);
    writeGames(games);

    res.json({ success: true, message: 'Game saved!', game });
});

// List all saved games (used later by leaderboard / stats)
router.get('/api/games', (req, res) => {
    res.json(readGames());
});

module.exports = router;
