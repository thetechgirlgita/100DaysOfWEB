// 1. Initialize the Variables
let count = 0;

// 2. Select the elements from the HTML
const display = document.getElementById('display');
const addBtn = document.getElementById('addBtn');
const lowerBtn = document.getElementById('lowerBtn');
const resetBtn = document.getElementById('resetBtn');

// 3. Defining the (Functions)

// Increase Logic
addBtn.addEventListener('click', () => {
    count++; // Adds 1 to the current count
    updateDisplay();
});

// Decrease Logic
lowerBtn.addEventListener('click', () => {
    count--; // Subtracts 1 from the count
    updateDisplay();
});

// Reset Logic
resetBtn.addEventListener('click', () => {
    count = 0; // Sets back to zero
    updateDisplay();
});

// 4. Update the Screen
function updateDisplay() {
    display.textContent = count;

    // Change color if negative
    if (count < 0) {
        display.style.color = "#ff4757"; // Red
    } else if (count > 0) {
        display.style.color = "#00f2ff"; // Cyan
    } else {
        display.style.color = "white";
    }
    
}