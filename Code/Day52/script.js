const rollBtn = document.getElementById("rollBtn");
const diceResult = document.getElementById("diceResult");

rollBtn.onclick = function() {
    
    let randomNum = Math.floor(Math.random() * 6) + 1;
    
    // Update the UI
    diceResult.textContent = randomNum;
    
    // Console log for debugging 
    console.log("User rolled a: " + randomNum);
};