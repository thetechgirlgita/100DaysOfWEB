function updateClock() {
    // Gets current date and time
    const now = new Date(); 

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12 || 12;
    hours = hours.toString().padStart(2, '0');

    const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;
    document.getElementById('clock').textContent = timeString;

    // Update the date too
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date-display').textContent = now.toLocaleDateString(undefined, options);
}

// Update the clock every 1 second (1000 milliseconds)
setInterval(updateClock, 1000);

// Call it once immediately so it doesn't wait 1 second to start
updateClock();