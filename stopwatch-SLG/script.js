// Screen Management
const screens = {
  main: document.getElementById("main-screen"),
  stopwatch: document.getElementById("stopwatch-screen"),
  countdownInput: document.getElementById("countdown-input-screen"),
  countdownRunning: document.getElementById("countdown-running-screen"),
};

function showScreen(screenName) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[screenName].classList.add("active");
}

// Utility function to format time
function formatTime(hours, minutes, seconds, milliseconds) {
  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
    milliseconds: String(milliseconds).padStart(3, "0"),
  };
}

// Update display function
function updateDisplay(screen, hours, minutes, seconds, milliseconds) {
  const formatted = formatTime(hours, minutes, seconds, milliseconds);
  screen.querySelector(".hours").textContent = formatted.hours;
  screen.querySelector(".minutes").textContent = formatted.minutes;
  screen.querySelector(".seconds").textContent = formatted.seconds;
  screen.querySelector(".milliseconds").textContent = formatted.milliseconds;
}

// ==================== STOPWATCH ====================
let stopwatchInterval = null;
let stopwatchElapsed = 0; // Total elapsed time in milliseconds
let stopwatchRunning = false;
let stopwatchLastTime = 0;

const stopwatchStartBtn = document.getElementById("stopwatch-start");
const stopwatchClearBtn = document.getElementById("stopwatch-clear");
const stopwatchBackBtn = document.getElementById("stopwatch-back");

function updateStopwatchDisplay() {
  const totalMs = Math.floor(stopwatchElapsed);
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const milliseconds = totalMs % 1000;

  updateDisplay(screens.stopwatch, hours, minutes, seconds, milliseconds);
}

function startStopwatch() {
  if (stopwatchRunning) {
    // Pause
    stopwatchRunning = false;
    stopwatchStartBtn.textContent = "Start";
    stopwatchStartBtn.classList.remove("pause");
    if (stopwatchInterval) {
      cancelAnimationFrame(stopwatchInterval);
      stopwatchInterval = null;
    }
  } else {
    // Start
    stopwatchRunning = true;
    stopwatchStartBtn.textContent = "Pause";
    stopwatchStartBtn.classList.add("pause");
    stopwatchLastTime = performance.now();

    function tick() {
      if (!stopwatchRunning) return;

      const currentTime = performance.now();
      const delta = currentTime - stopwatchLastTime;
      stopwatchLastTime = currentTime;

      stopwatchElapsed += delta;
      updateStopwatchDisplay();

      stopwatchInterval = requestAnimationFrame(tick);
    }

    stopwatchInterval = requestAnimationFrame(tick);
  }
}

function clearStopwatch() {
  stopwatchRunning = false;
  stopwatchElapsed = 0;
  if (stopwatchInterval) {
    cancelAnimationFrame(stopwatchInterval);
    stopwatchInterval = null;
  }
  stopwatchStartBtn.textContent = "Start";
  stopwatchStartBtn.classList.remove("pause");
  updateStopwatchDisplay();
}

stopwatchStartBtn.addEventListener("click", startStopwatch);
stopwatchClearBtn.addEventListener("click", clearStopwatch);
stopwatchBackBtn.addEventListener("click", () => {
  clearStopwatch();
  showScreen("main");
});

// ==================== COUNTDOWN INPUT ====================
let countdownInput = ""; // String of digits (max 6 digits for hhmmss)
const maxInputDigits = 6;

const keypadButtons = document.querySelectorAll(".key-btn[data-digit]");
const countdownInputClearBtn = document.getElementById("countdown-input-clear");
const countdownSetBtn = document.getElementById("countdown-set");
const countdownInputBackBtn = document.getElementById("countdown-input-back");

function updateCountdownInputDisplay() {
  // Pad the input to 6 digits
  const padded = countdownInput.padStart(6, "0");

  // Extract parts (hhmmss)
  const hours = parseInt(padded.substring(0, 2), 10);
  const minutes = parseInt(padded.substring(2, 4), 10);
  const seconds = parseInt(padded.substring(4, 6), 10);

  updateDisplay(screens.countdownInput, hours, minutes, seconds, 0);
}

function addDigitToCountdown(digit) {
  if (countdownInput.length < maxInputDigits) {
    countdownInput += digit;
    updateCountdownInputDisplay();

    // Disable keypad if full
    if (countdownInput.length === maxInputDigits) {
      keypadButtons.forEach((btn) => (btn.disabled = true));
    }
  }
}

function clearCountdownInput() {
  countdownInput = "";
  updateCountdownInputDisplay();
  keypadButtons.forEach((btn) => (btn.disabled = false));
}

function normalizeTime(hours, minutes, seconds, milliseconds) {
  // Convert everything to milliseconds
  let totalMs =
    milliseconds + seconds * 1000 + minutes * 60000 + hours * 3600000;

  // Convert back to normalized values
  const normHours = Math.floor(totalMs / 3600000);
  totalMs %= 3600000;
  const normMinutes = Math.floor(totalMs / 60000);
  totalMs %= 60000;
  const normSeconds = Math.floor(totalMs / 1000);
  const normMilliseconds = totalMs % 1000;

  return {
    hours: normHours,
    minutes: normMinutes,
    seconds: normSeconds,
    milliseconds: normMilliseconds,
  };
}

function setCountdown() {
  if (countdownInput.trim() === "" || parseInt(countdownInput, 10) === 0) {
    return; // Don't allow setting zero time
  }

  // Parse the input
  const padded = countdownInput.padStart(6, "0");
  const hours = parseInt(padded.substring(0, 2), 10);
  const minutes = parseInt(padded.substring(2, 4), 10);
  const seconds = parseInt(padded.substring(4, 6), 10);

  // Normalize the time
  const normalized = normalizeTime(hours, minutes, seconds, 0);

  // Set the countdown time
  countdownTimeRemaining =
    normalized.hours * 3600000 +
    normalized.minutes * 60000 +
    normalized.seconds * 1000 +
    normalized.milliseconds;
  countdownInitialTime = countdownTimeRemaining;

  // Update the running screen display
  updateCountdownRunningDisplay();

  // Switch to running screen
  showScreen("countdownRunning");

  // Reset input for next time
  countdownInput = "";
}

keypadButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const digit = btn.getAttribute("data-digit");
    addDigitToCountdown(digit);
  });
});

countdownInputClearBtn.addEventListener("click", clearCountdownInput);
countdownSetBtn.addEventListener("click", setCountdown);
countdownInputBackBtn.addEventListener("click", () => {
  clearCountdownInput();
  showScreen("main");
});

// ==================== COUNTDOWN RUNNING ====================
let countdownInterval = null;
let countdownTimeRemaining = 0; // Total time in milliseconds
let countdownInitialTime = 0; // Initial time for reset
let countdownRunning = false;
let countdownLastTime = 0;

const countdownStartBtn = document.getElementById("countdown-start");
const countdownClearBtn = document.getElementById("countdown-clear");
const countdownRunningBackBtn = document.getElementById(
  "countdown-running-back",
);

function updateCountdownRunningDisplay() {
  const totalMs = Math.max(0, Math.floor(countdownTimeRemaining));
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const milliseconds = countdownRunning ? totalMs % 1000 : 0;

  updateDisplay(
    screens.countdownRunning,
    hours,
    minutes,
    seconds,
    milliseconds,
  );
}

function startCountdown() {
  if (countdownRunning) {
    // Pause
    countdownRunning = false;
    countdownStartBtn.textContent = "Start";
    countdownStartBtn.classList.remove("pause");
    if (countdownInterval) {
      cancelAnimationFrame(countdownInterval);
      countdownInterval = null;
    }
  } else {
    // Start
    if (countdownTimeRemaining <= 0) {
      return; // Don't start if time is zero
    }

    countdownRunning = true;
    countdownStartBtn.textContent = "Pause";
    countdownStartBtn.classList.add("pause");
    countdownLastTime = performance.now();

    function tick() {
      if (!countdownRunning) return;

      const currentTime = performance.now();
      const delta = currentTime - countdownLastTime;
      countdownLastTime = currentTime;

      countdownTimeRemaining -= delta;

      if (countdownTimeRemaining <= 0) {
        countdownTimeRemaining = 0;
        countdownRunning = false;
        countdownStartBtn.textContent = "Start";
        countdownStartBtn.classList.remove("pause");
        updateCountdownRunningDisplay();

        // Play completion animation
        const display =
          screens.countdownRunning.querySelector(".timer-display");
        display.classList.add("complete");
        setTimeout(() => display.classList.remove("complete"), 1500);

        return;
      }

      updateCountdownRunningDisplay();
      countdownInterval = requestAnimationFrame(tick);
    }

    countdownInterval = requestAnimationFrame(tick);
  }
}

function clearCountdown() {
  countdownRunning = false;
  if (countdownInterval) {
    cancelAnimationFrame(countdownInterval);
    countdownInterval = null;
  }
  countdownStartBtn.textContent = "Start";
  countdownStartBtn.classList.remove("pause");

  // Reset to initial time
  countdownTimeRemaining = countdownInitialTime;
  updateCountdownRunningDisplay();
}

countdownStartBtn.addEventListener("click", startCountdown);
countdownClearBtn.addEventListener("click", clearCountdown);
countdownRunningBackBtn.addEventListener("click", () => {
  countdownRunning = false;
  if (countdownInterval) {
    cancelAnimationFrame(countdownInterval);
    countdownInterval = null;
  }
  countdownStartBtn.textContent = "Start";
  countdownStartBtn.classList.remove("pause");
  showScreen("main");
});

// ==================== MAIN MENU ====================
document.getElementById("stopwatch-btn").addEventListener("click", () => {
  showScreen("stopwatch");
});

document.getElementById("countdown-btn").addEventListener("click", () => {
  showScreen("countdownInput");
});

// Initialize displays
updateStopwatchDisplay();
updateCountdownInputDisplay();
