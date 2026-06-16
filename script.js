/* ==================================
   MoneyLens AI - script.js
   ================================== */

const URL = "./model/";

let model;
let webcam;
let historyData = [];
let currentDetectedNote = "";

/* ===========================
   Currency Data
   =========================== */

const noteInfo = {

    "₹10": {
        value: 10,
        words: "Ten Rupees",
        color: "Chocolate Brown"
    },

    "₹20": {
        value: 20,
        words: "Twenty Rupees",
        color: "Greenish Yellow"
    },

    "₹50": {
        value: 50,
        words: "Fifty Rupees",
        color: "Fluorescent Blue"
    },

    "₹100": {
        value: 100,
        words: "One Hundred Rupees",
        color: "Lavender"
    },

    "₹200": {
        value: 200,
        words: "Two Hundred Rupees",
        color: "Bright Orange"
    },

    "₹500": {
        value: 500,
        words: "Five Hundred Rupees",
        color: "Stone Grey"
    }

};

/* ===========================
   Initialize AI
   =========================== */

async function init() {

    if (model) return;

    document.getElementById("loading").style.display = "block";

    try {

        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        model = await tmImage.load(
            modelURL,
            metadataURL
        );

        webcam = new tmImage.Webcam(
            350,
            350,
            true
        );

        await webcam.setup();
        await webcam.play();

        document.getElementById(
            "webcam-container"
        ).innerHTML = "";

        document.getElementById(
            "webcam-container"
        ).appendChild(
            webcam.canvas
        );

        document.getElementById(
            "loading"
        ).style.display = "none";

        window.requestAnimationFrame(loop);

        detectDevice();

    } catch (error) {

        console.error(error);

        alert(
            "Failed to load AI model or camera."
        );
    }
}

/* ===========================
   Detect Device Type
   =========================== */

function detectDevice() {

    const isMobile =
        /Android|iPhone|iPad|iPod/i
        .test(navigator.userAgent);

    if (!isMobile) {

        const selector =
            document.getElementById(
                "cameraSelect"
            );

        if (selector) {

            selector.style.display = "none";
        }
    }
}

/* ===========================
   Prediction Loop
   =========================== */

async function loop() {

    webcam.update();

    await predict();

    window.requestAnimationFrame(loop);
}

/* ===========================
   Predict Currency
   =========================== */

async function predict() {

    const prediction =
        await model.predict(
            webcam.canvas
        );

    let highest =
        prediction[0];

    for (
        let i = 1;
        i < prediction.length;
        i++
    ) {

        if (
            prediction[i].probability >
            highest.probability
        ) {

            highest =
                prediction[i];
        }
    }

    const confidence =
        (
            highest.probability * 100
        ).toFixed(2);

    document.getElementById(
        "confidence"
    ).innerText =
        confidence + "%";

    document.getElementById(
        "progress"
    ).style.width =
        confidence + "%";

    /* Ignore weak detections */

    if (
        highest.probability < 0.75
    ) {

        document.getElementById(
            "currency"
        ).innerText =
            "No Note Detected";

        return;
    }

    currentDetectedNote =
        highest.className;

    document.getElementById(
        "currency"
    ).innerText =
        highest.className;

    const note =
        noteInfo[
            highest.className
        ];

    if (!note) return;

    /* Currency Details */

    document.getElementById(
        "value"
    ).innerText =
        "₹" + note.value;

    document.getElementById(
        "words"
    ).innerText =
        note.words;

    document.getElementById(
        "color"
    ).innerText =
        note.color;

    updateCurrencyConversion(
        note.value
    );

    updateHistory(
        highest.className
    );
}

/* ===========================
   Currency Conversion
   =========================== */

function updateCurrencyConversion(
    amount
) {

    /* Approximate values */

    const usd =
        (amount / 86).toFixed(2);

    const eur =
        (amount / 101).toFixed(2);

    const gbp =
        (amount / 118).toFixed(2);

    const aed =
        (amount / 23.5).toFixed(2);

    document.getElementById(
        "usd"
    ).innerText =
        "$ " + usd;

    document.getElementById(
        "eur"
    ).innerText =
        "€ " + eur;

    document.getElementById(
        "gbp"
    ).innerText =
        "£ " + gbp;

    document.getElementById(
        "aed"
    ).innerText =
        "AED " + aed;
}

/* ===========================
   Detection History
   =========================== */

function updateHistory(
    currency
) {

    if (
        historyData.length > 0 &&
        historyData[0] === currency
    ) {
        return;
    }

    historyData.unshift(
        currency
    );

    if (
        historyData.length > 5
    ) {

        historyData.pop();
    }

    const historyList =
        document.getElementById(
            "historyList"
        );

    historyList.innerHTML = "";

    historyData.forEach(
        item => {

            const li =
                document.createElement(
                    "li"
                );

            li.innerText =
                item;

            historyList.appendChild(
                li
            );
        }
    );
}

/* ===========================
   Voice Assistant
   =========================== */

function speakResult() {

    if (
        !currentDetectedNote
    ) {

        alert(
            "No currency detected."
        );

        return;
    }

    const note =
        noteInfo[
            currentDetectedNote
        ];

    const text =
        "Detected " +
        note.words;

    const speech =
        new SpeechSynthesisUtterance(
            text
        );

    speech.rate = 1;
    speech.pitch = 1;

    speechSynthesis.speak(
        speech
    );
}

/* ===========================
   Money Animation
   =========================== */

(function createMoneyFlow() {

    const container =
        document.getElementById(
            "money-flow"
        );

    if (!container) return;

    const count = 35;

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const note =
            document.createElement(
                "div"
            );

        note.className =
            "banknote";

        note.innerText =
            "₹";

        note.style.left =
            Math.random() *
            100 +
            "%";

        note.style.fontSize =
            (
                Math.random() *
                25 +
                15
            ) + "px";

        note.style.animationDuration =
            (
                Math.random() *
                10 +
                8
            ) + "s";

        note.style.animationDelay =
            (
                Math.random() *
                5
            ) + "s";

        container.appendChild(
            note
        );
    }

})();