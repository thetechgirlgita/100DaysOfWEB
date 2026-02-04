const textBox = document.getElementById("textBox");
const toFahrenheit = document.getElementById("toFahrenheit");
const toCelsius = document.getElementById("toCelsius");
const result = document.getElementById("result");
const submitBtn = document.getElementById("submitBtn");

let temp;

submitBtn.onclick = function() {
    // Convert the input string into a Number
    temp = Number(textBox.value);

    if (toFahrenheit.checked) {
        // Formula: (Celsius * 9/5) + 32
        temp = (temp * 9 / 5) + 32;
        result.textContent = temp.toFixed(1) + "°F";
    } 
    else if (toCelsius.checked) {
        // Formula: (Fahrenheit - 32) * 5/9
        temp = (temp - 32) * (5 / 9);
        result.textContent = temp.toFixed(1) + "°C";
    } 
    else {
        result.textContent = "Select a unit first!";
    }
};