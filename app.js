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

const options = document.querySelector("#options");
const singleEasy = document.querySelector("#single-easy");
const singleHard = document.querySelector("#single-hard");
const twoPlayer = document.querySelector("#two-player");
const startButton = document.querySelector("#start-button");
let mode;
let turns = 0;
let result = "";

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
    symbol: "O"
}

let player2 = {
    name: "Player 2",
    symbol: "🗙"
}

let combinations = {
    rows: [],
    cols: [],
    diags: []
}

const game = (function(){
    // This function increments the turn count and only after 4 turns is it possible to have
    // a winner. Depending on the result it shows a different message.
    const playTurn = function(i, j, player) {
        game.updateDisplay(i, j, player);
        turns++
        game.updateCombinations();
        if(turns > 4) result = game.checkWinner(player);

        if (result !== "") {
            if (result === "Player 1") display.textContent =`${result} wins. Congratulations!`;
            else if (mode === "single-easy" || mode === "single-hard") display.textContent =`The computer wins. Better luck next time!`;
            else display.textContent =`${result} wins. Congratulations!`;
            display.style = "font-weight: bold";
            return;
        }
        if (result === "" && turns === 9) {
            display.textContent = "It's a draw. Nobody wins this round";
            display.style = "font-weight: bold";
            return;
        }
    }

    const updateDisplay = function(i, j, player){
        gameBoard[i][j] = player.symbol;
        squares[i][j].textContent = `${player.symbol}`;
    }

    // There are only 8 ways to win this game. checkWinner() checks each possiblity after
    // every turn. All squares of the winning combination have the .winner class added
    // which turns the background gold.

    const updateCombinations = function() {
        combinations.rows = [gameBoard[0], gameBoard[1], gameBoard[2]];
        combinations.cols = [
                [gameBoard[0][0], gameBoard[1][0], gameBoard[2][0]],
                [gameBoard[0][1], gameBoard[1][1], gameBoard[2][1]],
                [gameBoard[0][2], gameBoard[1][2], gameBoard[2][2]]
            ];
        combinations.diags = [
                [gameBoard[0][0], gameBoard[1][1], gameBoard[2][2]],
                [gameBoard[0][2], gameBoard[1][1], gameBoard[2][0]]
            ];
    }

    const checkWinner = function(player){
        let symbol = player.symbol;
        let opposite;
        (player.symbol === "O")? opposite = "🗙": opposite = "O";

        for (let row of combinations.rows){
            if ((row.includes(symbol)) && (!row.includes(opposite)) && (!row.includes(""))){
                squares[combinations.rows.indexOf(row)].forEach(square => square.classList.add("winner"));
                return player.name;
            }
        }
        for (let col of combinations.cols){
            if ((col.includes(symbol)) && (!col.includes(opposite)) && (!col.includes(""))){
                let indices = [[0, combinations.cols.indexOf(col)], [1, combinations.cols.indexOf(col)], [2, combinations.cols.indexOf(col)]]
                indices.forEach(index => squares[index[0]][index[1]].classList.add("winner"));
                return player.name;
            }
        }
        for (let diag of combinations.diags){
            if ((diag.includes(symbol)) && (!diag.includes(opposite)) && (!diag.includes(""))){
                let indices = [[0, 0], [1, 1], [2, 2]];
                if ((gameBoard[2][0] === symbol) && (gameBoard[1][1] === symbol) && (gameBoard[0][2] === symbol)) indices = [[2, 0], [1, 1], [0, 2]];
                indices.forEach(index => squares[index[0]][index[1]].classList.add("winner"));
                return player.name;
            }
        }
        return "";
    }
    return {playTurn, updateDisplay, updateCombinations, checkWinner};
})()

// In single player mode, the computer's turn is activated after the user clicks a square.
// The computer chooses a position after a slight delay during which the user cannot
// click anything and ruin the game's flow.
function easyMode() {
    let computerChoice = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
    let player = player1;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            squares[i][j].addEventListener("click", () => {
                if ((turns < 10) && (gameBoard[i][j] === "") && !result && (player === player1)){
                    game.playTurn(i, j, player);
                    player = player2

                    if (!result & (turns < 9)) {
                        while (gameBoard[computerChoice[0]][computerChoice[1]] !== "") {
                            computerChoice = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
                        }
                        setTimeout(() => {
                            game.playTurn(computerChoice[0], computerChoice[1], player);
                            player = player1;
                        }, 1500);
                    }
                }
            });
        }
    }
}

function hardMode() {
    let computerChoice;
    let player = player1;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            squares[i][j].addEventListener("click", () => {
                computerChoice = [];
                if ((turns < 10) && (gameBoard[i][j] === "") && !result && (player === player1)){
                    game.playTurn(i, j, player);
                    player = player2

                    if (!result & (turns < 9)) {
                        for (let row of combinations.rows){
                            if (row.filter(value => value === player1.symbol).length === 2 && row.includes("") 
                            || row.filter(value => value === player2.symbol).length === 2 && row.includes("") ){
                                computerChoice.push(combinations.rows.indexOf(row));
                                computerChoice.push(row.indexOf(""));
                            }
                        }
                        for (let col of combinations.cols){
                            if (col.filter(value => value === player1.symbol).length === 2 && col.includes("") 
                            || col.filter(value => value === player2.symbol).length === 2 && col.includes("") ){
                                computerChoice.push(col.indexOf(""));
                                computerChoice.push(combinations.cols.indexOf(col));
                                
                            }
                        }
                        for (let diag of combinations.diags){
                            if (diag.filter(value => value === player1.symbol).length === 2 && diag.includes("") 
                            || diag.filter(value => value === player2.symbol).length === 2 && diag.includes("") ){
                                if (combinations.diags.indexOf(diag) === 0) {
                                    computerChoice.push(diag.indexOf(""));
                                    computerChoice.push(diag.indexOf(""));
                                }
                                else {
                                    computerChoice.push(diag.indexOf(""));
                                    computerChoice.push(2- diag.indexOf(""));
                                }
                            }
                        }
                        if (!computerChoice.length) {
                            computerChoice = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
                            while (gameBoard[computerChoice[0]][computerChoice[1]] !== "") {
                                computerChoice = [Math.floor(Math.random() * 3), Math.floor(Math.random() * 3)];
                            }
                        }
                        setTimeout(() => {
                            game.playTurn(computerChoice[0], computerChoice[1], player);
                            player = player1;
                        }, 1500);
                    }
                }
            });
        }
    }
}

function twoPlayerMode() {
    let player = player1;
    player1.symbol = "O";
    player2.symbol = "🗙"; 

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            squares[i][j].addEventListener("click", () => {
                if ((turns < 10) && (gameBoard[i][j] === "") && (!result)){
                    game.playTurn(i, j, player);
                    (player === player1)? player = player2: player = player1;
                }
            });
        }
    }
}

options.showModal();

singleEasy.addEventListener("click", () => {
    singleEasy.classList.add("selected-mode");
    singleHard.classList.remove("selected-mode");
    twoPlayer.classList.remove("selected-mode");
    mode = "single-easy";
})

singleHard.addEventListener("click", () => {
    singleHard.classList.add("selected-mode");
    singleEasy.classList.remove("selected-mode");
    twoPlayer.classList.remove("selected-mode");
    mode = "single-hard";
})

twoPlayer.addEventListener("click", () => {
    twoPlayer.classList.add("selected-mode");
    singleEasy.classList.remove("selected-mode");
    singleHard.classList.remove("selected-mode");
    mode = "two-player"
})

startButton.addEventListener("click", () => {
    if (mode) {
        if (mode === "single-easy") easyMode();
        else if (mode === "single-hard") hardMode();
        else twoPlayerMode();
        options.close();
    }
})

resetButton.addEventListener("click", () => {
    location.reload();
});