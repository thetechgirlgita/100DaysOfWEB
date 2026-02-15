let currentScreen = "";
let currentMovie = "";
let moviePrice = 0;
const rowLetters = ['A', 'B', 'C', 'D', 'E'];

function openTheater(screen, title, price) {
    currentScreen = screen;
    currentMovie = title;
    moviePrice = price;
    
    document.getElementById('lobby').classList.add('hidden');
    document.getElementById('theater').classList.remove('hidden');
    document.getElementById('activeMovie').innerText = `${title} (${screen})`;
    
    renderSeats();
}

function renderSeats() {
    const grid = document.getElementById('seatGrid');
    grid.innerHTML = "";
    
    // Load occupied seats for THIS specific screen (e.g., "Screen 1")
    const occupied = JSON.parse(localStorage.getItem(currentScreen)) || [];

    for (let i = 0; i < 40; i++) {
        const row = rowLetters[Math.floor(i / 8)];
        const col = (i % 8) + 1;
        const seatID = `${row}${col}`;

        const seat = document.createElement('div');
        const isTaken = occupied.includes(seatID);
        
        seat.className = isTaken ? 'seat occupied' : 'seat';
        seat.innerText = isTaken ? "" : seatID; // Show A1, B2 etc.
        seat.style.fontSize = "8px";
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
    const count = document.querySelectorAll('.seat.selected').length;
    document.getElementById('total').innerText = count * moviePrice;
}

function issueReceipt() {
    const selectedNodes = document.querySelectorAll('.seat.selected');
    if (selectedNodes.length === 0) return alert("Please select seats!");

    let selectedIDs = [];
    let occupied = JSON.parse(localStorage.getItem(currentScreen)) || [];

    selectedNodes.forEach(node => {
        selectedIDs.push(node.dataset.id);
        occupied.push(node.dataset.id); // Permanently book
    });

    localStorage.setItem(currentScreen, JSON.stringify(occupied));

    // Show the Receipt
    document.getElementById('receiptBody').innerHTML = `
        <h3>CINE-LOCAL RECEIPT</h3>
        <p><strong>Movie:</strong> ${currentMovie}</p>
        <p><strong>Hall:</strong> ${currentScreen}</p>
        <p><strong>Seats:</strong> ${selectedIDs.join(', ')}</p>
        <hr>
        <p><strong>Total: $${selectedIDs.length * moviePrice}</strong></p>
        <p style="font-size:10px">ID: ${Math.random().toString(36).substr(2, 5).toUpperCase()}</p>
    `;
    document.getElementById('receiptModal').classList.remove('hidden');
}

function closeReceipt() {
    document.getElementById('receiptModal').classList.add('hidden');
    goBack(); // Return to lobby after booking
}

function goBack() {
    document.getElementById('lobby').classList.remove('hidden');
    document.getElementById('theater').classList.add('hidden');
    document.getElementById('total').innerText = "0"; // Reset price
}