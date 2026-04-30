const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to your JSON file
const activeGamesPath = path.join(__dirname, '../data/active_games.json');

router.post('/save', (req, res) => {
    // 1. Get the final game data from the frontend's request
    const { gameId, winner, finalBoard } = req.body;

    try {
        // 2. Read the current active games
        const gamesData = fs.readFileSync(activeGamesPath, 'utf8');
        let games = JSON.parse(gamesData);

        // 3. Find the game that just finished
        const gameIndex = games.findIndex(g => g.gameId === gameId);

        if (gameIndex !== -1) {
            // 4. Update the game object
            games[gameIndex].status = 'completed';
            games[gameIndex].winner = winner;
            games[gameIndex].board = finalBoard;

            // 5. Write the updated array back to active_games.json
            fs.writeFileSync(activeGamesPath, JSON.stringify(games, null, 2));

            res.json({ success: true, message: 'Game saved successfully!' });
        } else {
            res.status(404).json({ success: false, message: 'Game not found.' });
        }
    } catch (error) {
        console.error("Error saving game:", error);
        res.status(500).json({ success: false, message: 'Server error saving game.' });
    }
});

module.exports = router;

async function saveCompletedGame(gameId, winner, finalBoard) {
    try {
        const response = await fetch('/api/games/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // This payload matches what your backend is expecting
            body: JSON.stringify({
                gameId: gameId,
                winner: winner,
                finalBoard: finalBoard
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log("Game saved successfully to JSON!");
        } else {
            console.error("Backend error:", data.message);
        }
    } catch (error) {
        console.error("Network error while saving game:", error);
    }
}

function handleGameOver(winner) {
    // 1. Your existing code to update the UI
    document.getElementById('statusMessage').innerText = `${winner} wins!`;

    // 2. Variables you should already have tracking the current game
    // const currentGameId = ... 
    // const currentBoard = ["X", "O", "X", ...] 

    // 3. Call the save function!
    saveCompletedGame(currentGameId, winner, currentBoard);
}