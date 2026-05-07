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

// Get leaderboard data - players who won the most against AI
router.get('/api/leaderboard', (req, res) => {
    const games = readGames();
    
    // Filter games where mode is pva (Player vs AI) and there's a winner
    const aiGames = games.filter(g => g.mode === 'pva' && g.winner !== 'draw' && g.username);
    
    // Count wins per user against AI
    const playerStats = {};
    
    aiGames.forEach(game => {
        const username = game.username;
        if (!username) return;
        
        if (!playerStats[username]) {
            playerStats[username] = {
                username,
                wins: 0,
                losses: 0
            };
        }
        
        // In pva mode, if winner is X, player won; if winner is O, AI won
        // We need to check if the player was X or O
        // For simplicity, we'll assume player is always X in pva mode
        // So if winner is X, it's a player win; if winner is O, it's a loss
        if (game.winner === 'X') {
            playerStats[username].wins++;
        } else if (game.winner === 'O') {
            playerStats[username].losses++;
        }
    });
    
    // Convert to array and sort by wins (descending)
    const leaderboard = Object.values(playerStats)
        .sort((a, b) => b.wins - a.wins);
    
    res.json({ success: true, leaderboard });
});

module.exports = router;
