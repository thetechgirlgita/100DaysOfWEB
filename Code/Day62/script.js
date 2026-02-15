const noBtn = document.getElementById('noBtn');

// The "Run Away" Logic
noBtn.addEventListener('mouseover', () => {
    // Calculate boundaries so the button stays on screen
    const maxX = window.innerWidth - noBtn.offsetWidth - 20;
    const maxY = window.innerHeight - noBtn.offsetHeight - 20;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    // Set position to fixed so it can move relative to the viewport
    noBtn.style.position = 'fixed';
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;

    // Sarcastic phrases for the button
    const phrases = ["Try again", "Denied!", "Nope ❤️", "Wrong choice", "Error: Impossible"];
    noBtn.innerText = phrases[Math.floor(Math.random() * phrases.length)];
});

function nextPage() {
    document.getElementById('page1').classList.add('hidden');
    document.getElementById('page2').classList.remove('hidden');
}

function sendLove() {
    alert("Kiss confirmation received! You're stuck with me now. Happy Valentine's Day! 🥰");
}