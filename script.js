const board = document.getElementById("game-board");

const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");

const startButton = document.getElementById("start-button");
const message = document.getElementById("message");

let score = 0;
let time = 30;

let timer;
let tickTimer;

let gameRunning = false;


// =====================================
// AUDIO FILES
// =====================================

const tickSound =
    new Audio("mixkit-tick-tock-clock-close-up-1059.wav");

const correctSound =
    new Audio("mixkit-positive-notification-951.wav");

const wrongSound =
    new Audio("johnnybacon156-fah-469417.mp3");


// Preload sounds
tickSound.preload = "auto";
correctSound.preload = "auto";
wrongSound.preload = "auto";


// =====================================
// PLAY AUDIO
// =====================================

function playSound(sound) {

    sound.currentTime = 0;

    sound.play().catch(() => {
        // Browser may block audio until user interaction
    });
}


// =====================================
// CLOCK TICK
// =====================================

function startTicking() {

    stopTicking();

    // First tick
    playSound(tickSound);

    tickTimer = setInterval(() => {

        if (gameRunning) {

            playSound(tickSound);

        }

    }, 1000);
}


function stopTicking() {

    clearInterval(tickTimer);

    tickSound.pause();

    tickSound.currentTime = 0;
}


// =====================================
// START GAME
// =====================================

function startGame() {

    clearInterval(timer);

    stopTicking();

    score = 0;
    time = 30;

    gameRunning = true;

    scoreDisplay.textContent = score;
    timeDisplay.textContent = time;

    timeDisplay.classList.remove("warning");

    message.textContent = "";

    startButton.textContent =
        "Restart Game";


    createRound();

    // Start clock sound
    startTicking();


    // Game timer
    timer = setInterval(() => {

        time--;

        timeDisplay.textContent = time;


        if (time <= 5 && time > 0) {

            timeDisplay.classList.add(
                "warning"
            );
        }


        if (time <= 0) {

            endGame(
                "⏰ Time's Up!",
                true
            );

        }

    }, 1000);
}


// =====================================
// CREATE ROUND
// =====================================

function createRound() {

    board.innerHTML = "";


    const r =
        Math.floor(
            Math.random() * 180
        ) + 40;

    const g =
        Math.floor(
            Math.random() * 180
        ) + 40;

    const b =
        Math.floor(
            Math.random() * 180
        ) + 40;


    const baseColor =
        `rgb(${r}, ${g}, ${b})`;


    // Difficulty increases
    const difference =
        Math.max(
            5,
            35 - score * 2
        );


    const darkR =
        Math.max(
            0,
            r - difference
        );

    const darkG =
        Math.max(
            0,
            g - difference
        );

    const darkB =
        Math.max(
            0,
            b - difference
        );


    const darkColor =
        `rgb(${darkR}, ${darkG}, ${darkB})`;


    const correctPosition =
        Math.floor(
            Math.random() * 9
        );


    for (
        let i = 0;
        i < 9;
        i++
    ) {

        const box =
            document.createElement("div");


        box.classList.add(
            "color-box"
        );


        if (
            i === correctPosition
        ) {

            box.style.background =
                darkColor;

            box.dataset.correct =
                "true";

        } else {

            box.style.background =
                baseColor;

            box.dataset.correct =
                "false";
        }


        box.addEventListener(
            "click",
            checkAnswer
        );


        board.appendChild(box);
    }
}


// =====================================
// CHECK ANSWER
// =====================================

function checkAnswer(event) {

    if (!gameRunning) return;


    const box =
        event.target;


    // =================================
    // CORRECT ANSWER
    // =================================

    if (
        box.dataset.correct ===
        "true"
    ) {

        score++;

        scoreDisplay.textContent =
            score;


        // RESET TIME TO 30
        time = 30;

        timeDisplay.textContent =
            time;

        timeDisplay.classList.remove(
            "warning"
        );


        // Play winning sound
        playSound(correctSound);


        // Vibration
        if ("vibrate" in navigator) {

            navigator.vibrate(50);

        }


        // Visual effect
        box.classList.add(
            "correct-effect"
        );


        message.textContent =
            "🏆 CORRECT! +1";


        setTimeout(() => {

            if (gameRunning) {

                message.textContent =
                    "";

            }

        }, 600);


        // Next round
        setTimeout(() => {

            if (gameRunning) {

                createRound();

            }

        }, 150);

    }


    // =================================
    // WRONG ANSWER
    // =================================

    else {

        // Stop clock
        stopTicking();


        // Play FAAA-HHH sound
        playSound(wrongSound);


        // Vibration
        if ("vibrate" in navigator) {

            navigator.vibrate(
                [150, 70, 150]
            );

        }


        // Screen shake
        document.body.classList.add(
            "shake"
        );


        setTimeout(() => {

            document.body.classList.remove(
                "shake"
            );

        }, 350);


        // END GAME
        endGame(
            "😮‍💨 Faaahhh! Wrong Box!",
            false
        );

    }
}


// =====================================
// END GAME
// =====================================

function endGame(
    reason,
    timeEnded
) {

    if (!gameRunning) return;


    gameRunning = false;


    clearInterval(timer);

    stopTicking();


    board.innerHTML = "";


    timeDisplay.classList.remove(
        "warning"
    );


    message.textContent =
        `${reason} Final Score: ${score}`;


    startButton.textContent =
        "Play Again";
}


// =====================================
// START BUTTON
// =====================================

startButton.addEventListener(
    "click",
    startGame
);
