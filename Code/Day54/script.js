// 1. Setup the game "State"
let answer = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

const guessInput = document.getElementById("guessInput");
const submitBtn = document.getElementById("submitBtn");
const message = document.getElementById("message");
const attemptsCount = document.getElementById("attemptsCount");
const resetBtn = document.getElementById("resetBtn");

submitBtn.onclick = function() {
    let userGuess = Number(guessInput.value);
    attempts++;
    attemptsCount.textContent = attempts;

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        message.textContent = "Please enter a valid number between 1-100";
        message.style.color = "orange";
    } 
    else if (userGuess === answer) {
        message.textContent = `CORRECT! The answer was ${answer}. It took you ${attempts} tries.`;
        message.style.color = "#00f2ff";
        gameOver();
    } 
    else if (userGuess > answer) {
        message.textContent = "TOO HIGH! Try again.";
        message.style.color = "#ff4757";
    } 
    else {
        message.textContent = "TOO LOW! Try again.";
        message.style.color = "#ffa502";
    }
    
    guessInput.value = ""; // Clear input for next guess
};

function gameOver() {
    submitBtn.disabled = true;
    resetBtn.style.display = "block";
}

resetBtn.onclick = function() {
    location.reload(); // Simplest way to restart the game!
};