let currentScreen = "";
let currentMovie = "";
let moviePrice = 0;
const rowLetters = ['A', 'B', 'C', 'D', 'E'];
const ADMIN_PIN = "2026";

function openTheater(screen, title, price) {
    currentScreen = screen;
    currentMovie = title;
    moviePrice = price;
    
    document.getElementById('lobby').classList.add('hidden');
    document.getElementById('theater').classList.remove('hidden');
    document.getElementById('activeMovie').innerText = `${title} (${screen})`;
    
    // Hard Reset Ghost Seats
    document.getElementById('total').innerText = "0";
    
    renderSeats();
}

function renderSeats() {
    const grid = document.getElementById('seatGrid');
    grid.innerHTML = "";
    const occupied = JSON.parse(localStorage.getItem(currentScreen)) || [];

    for (let i = 0; i < 40; i++) {
        const seatID = `${rowLetters[Math.floor(i / 8)]}${(i % 8) + 1}`;
        const seat = document.createElement('div');
        const isTaken = occupied.includes(seatID);
        
        seat.className = isTaken ? 'seat occupied' : 'seat';
        seat.innerText = isTaken ? "" : seatID;
        seat.dataset.id = seatID;
        
        if (!isTaken) {
            seat.onclick = () => {
                seat.classList.toggle('selected');
                updateTotal();
            };
        }
        grid.appendChild(seat);
    }
}

function updateTotal() {
    // SELECTOR FIX: Only count selected seats inside the grid
    const count = document.querySelectorAll('#seatGrid .seat.selected').length;
    document.getElementById('total').innerText = (count * moviePrice).toFixed(2);
}

function issueReceipt() {
    const selectedNodes = document.querySelectorAll('#seatGrid .seat.selected');
    if (selectedNodes.length === 0) return alert("Select seats first!");

    let selectedIDs = Array.from(selectedNodes).map(n => n.dataset.id);
    let occupied = JSON.parse(localStorage.getItem(currentScreen)) || [];
    occupied.push(...selectedIDs);
    localStorage.setItem(currentScreen, JSON.stringify(occupied));

    document.getElementById('receiptBody').innerHTML = `
        <h2 style="margin-top:0">Hamro Cinema</h2>
        <p><strong>Movie:</strong> ${currentMovie}</p>
        <p><strong>Hall:</strong> ${currentScreen}</p>
        <p><strong>Seats:</strong> ${selectedIDs.join(', ')}</p>
        <hr>
        <p style="font-size: 1.2rem"><strong>Total: $${document.getElementById('total').innerText}</strong></p>
    `;
    document.getElementById('receiptModal').classList.remove('hidden');
}

function adminReset() {
    const pin = prompt("Admin PIN:");
    if (pin === ADMIN_PIN) {
        if (confirm("Clear bookings for " + currentScreen + "?")) {
            localStorage.removeItem(currentScreen);
            renderSeats();
            updateTotal();
        }
    }
}

function goBack() {
    document.getElementById('lobby').classList.remove('hidden');
    document.getElementById('theater').classList.add('hidden');
}

function closeReceipt() {
    document.getElementById('receiptModal').classList.add('hidden');
    goBack();
}