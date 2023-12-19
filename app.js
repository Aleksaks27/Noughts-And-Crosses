const one = document.querySelector("#one");
const two = document.querySelector("#two");
const three = document.querySelector("#three");
const four = document.querySelector("#four");
const five = document.querySelector("#five");
const six = document.querySelector("#six");
const seven = document.querySelector("#seven");
const eight = document.querySelector("#eight");
const nine = document.querySelector("#nine");

const squares = [
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
    const updateDisplay = function(i, j, player) {
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

    return {updateDisplay, checkWinner};
})()

function playGame() {
    let player = player1;
    let turns = 0;
    let result = "";
    let symbol = "O";

    if (symbol.toLowerCase() === "noughts" || symbol.toLowerCase() === "o") {
        player1.symbol = "O";
        player2.symbol = "X";
    }
    else {
        player1.symbol = "X";
        player2.symbol = "O";
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            squares[i][j].addEventListener("click", () => {
                if ((turns < 10) && (gameBoard[i][j] === "") && !result){
                    game.updateDisplay(i, j, player);
                    turns++;
                    if(turns > 4) result = game.checkWinner(player);
                    if (result !== "") {
                        console.log(`${result} wins. Congratulations!`);
                        return;
                    }
                    (player === player1)? player = player2: player = player1;
                    
                }
            });
        }
    }
    if (result === "" && turns === 9) console.log("It's a draw. Nobody wins this round");
}

playGame();