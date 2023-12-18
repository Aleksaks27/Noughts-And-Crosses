let gameBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

let player1 = {
    name: "Player 1",
    symbol: ""
}

let player2 = {
    name: "Player 2",
    symbol: ""
}

const game = (function(){
    const playTurn = function(player){
        let position = prompt("Choose your position on the grid (row, column)");
        let row = parseInt(position[0]);
        let column = parseInt(position[3]);
        while (gameBoard[row - 1][column - 1]) {
            position = prompt("That spot is already taken. Choose one that's free!");
            row = parseInt(position[0]);
            column = parseInt(position[3]);
        }
        gameBoard[row - 1][column - 1] = player.symbol;
    }

    const checkWinner = function(player){
        let combinations = {
            rows: [gameBoard[0], gameBoard[1], gameBoard[2]],
            cols: [
                [gameBoard[0][0], gameBoard[1][0], gameBoard[2][0]],
                [gameBoard[0][1], gameBoard[1][1], gameBoard[2][1]],
                [gameBoard[0][2], gameBoard[1][2], gameBoard[2][2]]
            ],
            diags: [
                [gameBoard[0][0], gameBoard[1][1], gameBoard[2][2]],
                [gameBoard[0][2], gameBoard[1][1], gameBoard[2][0]]
            ]
        }

        let symbol = player.symbol;
        let opposite;
        (player.symbol === "O")? opposite = "X": opposite = "O";

        for (let row of combinations.rows) {
            if ((row.includes(symbol)) && (!row.includes(opposite)) && (!row.includes(""))){
                return player.name;
            }
        }
        for (let col of combinations.cols) {
            if ((col.includes(symbol)) && (!col.includes(opposite)) && (!col.includes(""))){
                return player.name;
            }
        }
        for (let diag of combinations.diags) {
            if ((diag.includes(symbol)) && (!diag.includes(opposite)) && (!diag.includes(""))){
                return player.name;
            }
        }
        return "";
    }

    return {playTurn, checkWinner};
})()

function playGame() {
    let player = player1;
    let turns = 0;
    let result = "";
    const symbol = prompt("Noughts or crosses: What do you choose?");

    if (symbol.toLowerCase() === "noughts" || symbol.toLowerCase() === "o") {
        player1.symbol = "O";
        player2.symbol = "X";
    }
    else {
        player1.symbol = "X";
        player2.symbol = "O";
    }

    while ((turns < 9) && !result) {
        game.playTurn(player);
        turns++;
        console.log(gameBoard);
        if(turns > 4) result = game.checkWinner(player, result);
        (player === player1)? player = player2: player = player1;
    }

    if (result === "") console.log("It's a draw. Nobody wins this round");
    else console.log(`${result} wins. Congratulations!`);
}

playGame();