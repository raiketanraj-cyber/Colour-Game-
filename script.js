const board = document.getElementById("game-board");

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");

const startButton = document.getElementById("start-button");
const message = document.getElementById("message");

let score = 0;
let time = 30;
let timer;

let gameRunning = false;


// START GAME
function startGame() {

    score = 0;
    time = 30;

    gameRunning = true;

    scoreDisplay.textContent = score;
    timeDisplay.textContent = time;

    message.textContent = "";

    startButton.textContent = "Restart Game";

    createRound();

    clearInterval(timer);

    timer = setInterval(() => {

        time--;

        timeDisplay.textContent = time;

        if (time <= 0) {

            endGame();

        }

    }, 1000);
}


// CREATE A NEW ROUND
function createRound() {

    board.innerHTML = "";

    // Random base colour

    const r = Math.floor(Math.random() * 180) + 40;
    const g = Math.floor(Math.random() * 180) + 40;
    const b = Math.floor(Math.random() * 180) + 40;

    const baseColor = `rgb(${r}, ${g}, ${b})`;


    // Darker colour

    const difference =
        Math.max(5, 35 - score * 2);

    const darkR =
        Math.max(0, r - difference);

    const darkG =
        Math.max(0, g - difference);

    const darkB =
        Math.max(0, b - difference);

    const darkColor =
        `rgb(${darkR}, ${darkG}, ${darkB})`;


    // Random position for darker box

    const correctPosition =
        Math.floor(Math.random() * 9);


    // Create 9 boxes

    for (let i = 0; i < 9; i++) {

        const box =
            document.createElement("div");

        box.classList.add("color-box");


        if (i === correctPosition) {

            box.style.background = darkColor;

            box.dataset.correct = "true";

        } else {

            box.style.background = baseColor;

            box.dataset.correct = "false";

        }


        box.addEventListener(
            "click",
            checkAnswer
        );

        board.appendChild(box);
    }
}


// CHECK PLAYER'S ANSWER
function checkAnswer(event) {

    if (!gameRunning) return;

    const box = event.target;


    if (box.dataset.correct === "true") {

        // Correct answer

        score++;

        scoreDisplay.textContent = score;

        createRound();

    } else {

        // Wrong answer

        time -= 2;

        timeDisplay.textContent = time;

        message.textContent =
            "❌ Wrong! -2 seconds";

        setTimeout(() => {

            message.textContent = "";

        }, 800);
    }
}


// END GAME
function endGame() {

    gameRunning = false;

    clearInterval(timer);

    board.innerHTML = "";

    message.textContent =
        `🎉 Game Over! Your score: ${score}`;

    startButton.textContent =
        "Play Again";
}


// START BUTTON
startButton.addEventListener(
    "click",
    startGame
);
