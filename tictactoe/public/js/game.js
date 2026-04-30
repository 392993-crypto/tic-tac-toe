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
}