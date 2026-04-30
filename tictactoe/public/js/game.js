// ... (Keep your variables and boardState as they are)

function checkResult() {
    let roundWon = false;
    for (let condition of winningConditions) {
        let a = boardState[condition[0]];
        let b = boardState[condition[1]];
        let c = boardState[condition[2]];
        if (a === '' || b === '' || c === '') continue;
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusElement.innerText = `Player ${currentPlayer} Wins!`;
        gameActive = false;
        saveGame(currentPlayer); // Pass the winner
        return;
    }

    if (!boardState.includes("")) {
        statusElement.innerText = "It's a Draw!";
        gameActive = false;
        saveGame("Draw");
        return;
    }

    // Only switch players if the game is still going
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusElement.innerText = `Player ${currentPlayer}'s Turn`;
},

if (data.success) {
    // This will pop up a message box in your browser
    alert("Success: Game saved to JSON!"); 
} else {
    alert("Backend error: " + data.message);
},

router.post('/save', (req, res) => {
    const { gameId, winner, finalBoard } = req.body;

    // Add this line so your terminal prints exactly what the frontend sent
    console.log("RECEIVED SAVE REQUEST FOR GAME:", gameId, "WINNER:", winner); 

    try {
    // ... the rest of the try/catch block stays exactly the same