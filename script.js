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

    clearInterval(timer);

    score = 0;
    time = 30;

    gameRunning = true;

    scoreDisplay.textContent = score;
    timeDisplay.textContent = time;

    message.textContent = "";

    startButton.textContent = "Restart Game";

    createRound();

    timer = setInterval(() => {

        time--;

        timeDisplay.textContent = time;

        if (time <= 0) {

            endGame("⏰ Time's Up!");

        }

    }, 1000);
}


// CREATE NEW ROUND
function createRound() {

    board.innerHTML = "";

    // Random base colour
    const r = Math.floor(Math.random() * 180) + 40;
    const g = Math.floor(Math.random() * 180) + 40;
    const b = Math.floor(Math.random() * 180) + 40;

    const baseColor = `rgb(${r}, ${g}, ${b})`;


    // Make one colour darker
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


    // Random position for darkest box
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


// CHECK ANSWER
function checkAnswer(event) {

    if (!gameRunning) return;

    const box = event.target;


    // CORRECT ANSWER
    if (box.dataset.correct === "true") {

        score++;

        scoreDisplay.textContent = score;

        // RESET TIMER TO 30 SECONDS
        time = 30;

        timeDisplay.textContent = time;

        message.textContent = "✅ Correct! +1";

        setTimeout(() => {

            if (gameRunning) {
                message.textContent = "";
            }

        }, 600);

        createRound();

    }


    // WRONG ANSWER
    else {

        endGame("❌ Wrong Box!");

    }
}


// END GAME
function endGame(reason) {

    gameRunning = false;

    clearInterval(timer);

    board.innerHTML = "";

    message.textContent =
        `${reason} Final Score: ${score}`;

    startButton.textContent =
        "Play Again";
}


// START BUTTON
startButton.addEventListener(
    "click",
    startGame
);
