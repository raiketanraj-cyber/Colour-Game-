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

let audioContext;


// ========================================
// AUDIO ENGINE
// ========================================

function initAudio() {

    if (!audioContext) {

        audioContext =
            new (window.AudioContext ||
            window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
}


// ========================================
// CLOCK TICK
// ========================================

function playTick() {

    if (!gameRunning) return;

    initAudio();

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    oscillator.type = "square";

    oscillator.frequency.setValueAtTime(
        850,
        audioContext.currentTime
    );

    gain.gain.setValueAtTime(
        0.045,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.055
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.06
    );
}


// ========================================
// CLAP SOUND
// ========================================

function playClap() {

    initAudio();

    function clap(delay) {

        setTimeout(() => {

            const bufferSize =
                audioContext.sampleRate * 0.12;

            const buffer =
                audioContext.createBuffer(
                    1,
                    bufferSize,
                    audioContext.sampleRate
                );

            const data =
                buffer.getChannelData(0);

            for (
                let i = 0;
                i < bufferSize;
                i++
            ) {

                data[i] =
                    (Math.random() * 2 - 1) *
                    Math.pow(
                        1 - i / bufferSize,
                        5
                    );
            }

            const source =
                audioContext.createBufferSource();

            const filter =
                audioContext.createBiquadFilter();

            const gain =
                audioContext.createGain();

            source.buffer = buffer;

            filter.type = "highpass";

            filter.frequency.value = 900;

            gain.gain.value = 0.32;

            source.connect(filter);
            filter.connect(gain);
            gain.connect(
                audioContext.destination
            );

            source.start();

        }, delay);
    }

    // Two quick claps
    clap(0);
    clap(130);
}


// ========================================
// "FAAAHHH" WRONG SOUND
// ========================================

function playFaahhh() {

    initAudio();

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    const filter =
        audioContext.createBiquadFilter();


    oscillator.type = "sawtooth";

    oscillator.frequency.setValueAtTime(
        420,
        audioContext.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        75,
        audioContext.currentTime + 0.75
    );


    filter.type = "lowpass";

    filter.frequency.setValueAtTime(
        900,
        audioContext.currentTime
    );

    filter.frequency.exponentialRampToValueAtTime(
        250,
        audioContext.currentTime + 0.75
    );


    gain.gain.setValueAtTime(
        0.001,
        audioContext.currentTime
    );

    gain.gain.linearRampToValueAtTime(
        0.22,
        audioContext.currentTime + 0.08
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.8
    );


    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(
        audioContext.destination
    );


    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 0.85
    );
}


// ========================================
// TIME-UP SOUND
// ========================================

function playTimeUp() {

    initAudio();

    const notes = [500, 400, 300, 200];

    notes.forEach((frequency, index) => {

        setTimeout(() => {

            const oscillator =
                audioContext.createOscillator();

            const gain =
                audioContext.createGain();

            oscillator.type = "square";

            oscillator.frequency.value =
                frequency;

            gain.gain.setValueAtTime(
                0.07,
                audioContext.currentTime
            );

            gain.gain.exponentialRampToValueAtTime(
                0.001,
                audioContext.currentTime + 0.18
            );

            oscillator.connect(gain);

            gain.connect(
                audioContext.destination
            );

            oscillator.start();

            oscillator.stop(
                audioContext.currentTime + 0.2
            );

        }, index * 180);
    });
}


// ========================================
// START GAME
// ========================================

function startGame() {

    initAudio();

    clearInterval(timer);
    clearInterval(tickTimer);

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


    // Clock ticking
    playTick();

    tickTimer = setInterval(() => {

        if (gameRunning) {
            playTick();
        }

    }, 1000);


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


// ========================================
// CREATE ROUND
// ========================================

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


    // Difficulty increases with score
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


// ========================================
// CHECK ANSWER
// ========================================

function checkAnswer(event) {

    if (!gameRunning) return;


    const box =
        event.target;


    // ====================================
    // CORRECT
    // ====================================

    if (
        box.dataset.correct ===
        "true"
    ) {

        score++;

        scoreDisplay.textContent =
            score;


        // Reset timer
        time = 30;

        timeDisplay.textContent =
            time;

        timeDisplay.classList.remove(
            "warning"
        );


        // CLAP SOUND
        playClap();


        // Vibration
        if ("vibrate" in navigator) {
            navigator.vibrate(40);
        }


        // Visual effect
        box.classList.add(
            "correct-effect"
        );


        message.textContent =
            "👏 CORRECT! +1";


        setTimeout(() => {

            if (gameRunning) {

                message.textContent = "";
            }

        }, 600);


        setTimeout(() => {

            if (gameRunning) {

                createRound();
            }

        }, 150);

    }


    // ====================================
    // WRONG
    // ====================================

    else {

        // Stop clock immediately
        clearInterval(tickTimer);


        // FAAA-HHH sound
        playFaahhh();


        // Strong vibration
        if ("vibrate" in navigator) {

            navigator.vibrate(
                [120, 60, 120]
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


        // End game
        endGame(
            "😮‍💨 Faaahhh! Wrong Box!",
            false
        );
    }
}


// ========================================
// END GAME
// ========================================

function endGame(
    reason,
    timeEnded
) {

    if (!gameRunning) return;


    gameRunning = false;

    clearInterval(timer);
    clearInterval(tickTimer);


    board.innerHTML = "";


    timeDisplay.classList.remove(
        "warning"
    );


    if (timeEnded) {

        playTimeUp();

        if ("vibrate" in navigator) {

            navigator.vibrate(
                [150, 80, 150]
            );
        }

    }


    message.textContent =
        `${reason} Final Score: ${score}`;


    startButton.textContent =
        "Play Again";
}


// ========================================
// START BUTTON
// ========================================

startButton.addEventListener(
    "click",
    startGame
);      
