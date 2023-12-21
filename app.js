const one = document.querySelector("#one");
const two = document.querySelector("#two");
const three = document.querySelector("#three");
const four = document.querySelector("#four");
const five = document.querySelector("#five");
const six = document.querySelector("#six");
const seven = document.querySelector("#seven");
const eight = document.querySelector("#eight");
const nine = document.querySelector("#nine");
const resetButton = document.querySelector("#reset");
const display = document.querySelector("#display");

let squares = [
    [one, two, three],
    [four, five, six],
    [seven, eight, nine]
]

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

    const updateDisplay = function(i, j, player){
        gameBoard[i][j] = `${player.symbol}`;
        squares[i][j].textContent = `${player.symbol}`;
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

        for (let row of combinations.rows){
            if ((row.includes(symbol)) && (!row.includes(opposite)) && (!row.includes(""))){
                return player.name;
            }
        }
        for (let col of combinations.cols){
            if ((col.includes(symbol)) && (!col.includes(opposite)) && (!col.includes(""))){
                return player.name;
            }
        }
        for (let diag of combinations.diags){
            if ((diag.includes(symbol)) && (!diag.includes(opposite)) && (!diag.includes(""))){
                return player.name;
            }
        }
        return "";
    }

    const reset = function(turns, result){
        turns = 0;
        result = "";
        display.textContent = "Noughts start. Click the board to begin.";
        display.style = "font-weight: normal";
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                gameBoard[i][j] = "";
                squares[i][j].textContent = "";
                let newSquare = squares[i][j].cloneNode(true);
                squares[i][j].parentNode.replaceChild(newSquare, squares[i][j]);
                squares[i][j] = newSquare
            }
        }
    }

    return {updateDisplay, checkWinner, reset};
})()

function playGame() {
    let player = player1;
    let turns = 0;
    let result = "";
    player1.symbol = "O";
    player2.symbol = "X";

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            squares[i][j].addEventListener("click", () => {
                if ((turns < 10) && (gameBoard[i][j] === "") && !result){
                    game.updateDisplay(i, j, player);
                    turns++

                    if(turns > 4) result = game.checkWinner(player);

                    if (result !== "") {
                        display.textContent =`${result} wins. Congratulations!`;
                        display.style = "font-weight: bold";
                        return;
                    }
                    if (result === "" && turns === 9) {
                        display.textContent = "It's a draw. Nobody wins this round";
                        display.style = "font-weight: bold";
                        return;
                    }

                    (player === player1)? player = player2: player = player1;
                    
                }
            });
        }
    }


    resetButton.addEventListener("click", () => {
        game.reset(turns, result);
        playGame();
    });
}

playGame();