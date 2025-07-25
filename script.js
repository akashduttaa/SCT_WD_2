const htmlElement = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const currentYearSpan = document.getElementById('currentYear');

// Stopwatch display elements
const displayHours = document.getElementById('displayHours');
const displayMinutes = document.getElementById('displayMinutes');
const displaySeconds = document.getElementById('displaySeconds');
const displayMilliseconds = document.getElementById('displayMilliseconds');

// Stopwatch control buttons
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');
const lapButton = document.getElementById('lapButton');

// Lap times list
const lapList = document.getElementById('lapList');

// Stopwatch state
let milliseconds = 0;
let seconds = 0;
let minutes = 0;
let hours = 0;
let timerInterval;
let isRunning = false;
let lapCounter = 0;

function formatTime(num) {
    return num < 10 ? "0" + num : num;
}

function formatMilliseconds(num) {
    if (num < 10) return "00" + num;
    if (num < 100) return "0" + num;
    return num;
}

function updateDisplay() {
    displayMilliseconds.textContent = formatMilliseconds(milliseconds);
    displaySeconds.textContent = formatTime(seconds);
    displayMinutes.textContent = formatTime(minutes);
    displayHours.textContent = formatTime(hours);
}

function incrementTime() {
    milliseconds += 10;
    if (milliseconds === 1000) {
        milliseconds = 0;
        seconds++;
        if (seconds === 60) {
            seconds = 0;
            minutes++;
            if (minutes === 60) {
                minutes = 0;
                hours++;
            }
        }
    }
    updateDisplay();
}

function startStopwatch() {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(incrementTime, 10);
        startButton.disabled = true;
        pauseButton.disabled = false;
        resetButton.disabled = false;
        lapButton.disabled = false;
    }
}

function pauseStopwatch() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timerInterval);
        startButton.disabled = false;
        pauseButton.disabled = true;
    }
}

function resetStopwatch() {
    clearInterval(timerInterval);
    isRunning = false;
    milliseconds = 0;
    seconds = 0;
    minutes = 0;
    hours = 0;
    lapCounter = 0;
    updateDisplay();
    lapList.innerHTML = '<li class="text-gray-500 dark:text-gray-400">No laps recorded yet.</li>';
    startButton.disabled = false;
    pauseButton.disabled = true;
    resetButton.disabled = true;
    lapButton.disabled = true;
}

function recordLap() {
    if (isRunning) {
        lapCounter++;
        const lapTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}.${formatMilliseconds(milliseconds)}`;
        const lapItem = document.createElement('li');
        lapItem.classList.add('py-1', 'border-b', 'border-gray-200', 'dark:border-gray-600', 'flex', 'justify-between', 'items-center');
        lapItem.innerHTML = `
            <span>Lap ${lapCounter}:</span>
            <span class="font-mono text-indigo-600 dark:text-indigo-300">${lapTime}</span>
        `;
        if (lapList.querySelector('li.text-gray-500')) {
            lapList.innerHTML = '';
        }
        lapList.prepend(lapItem);
    }
}

startButton.addEventListener('click', startStopwatch);
pauseButton.addEventListener('click', pauseStopwatch);
resetButton.addEventListener('click', resetStopwatch);
lapButton.addEventListener('click', recordLap);

function applyThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        htmlElement.classList.add('dark');
        themeToggle.checked = true;
    } else {
        htmlElement.classList.remove('dark');
        themeToggle.checked = false;
    }
}

function toggleDarkMode() {
    htmlElement.classList.toggle('dark');
    if (htmlElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
}

themeToggle.addEventListener('change', toggleDarkMode);

document.addEventListener('DOMContentLoaded', () => {
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    applyThemePreference();
    updateDisplay();
});
