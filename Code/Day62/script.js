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
    document.getElementById('coupleToggle').checked = false; // Reset toggle
    
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
    const selectedCount = document.querySelectorAll('.seat.selected').length;
    const isCouple = document.getElementById('coupleToggle').checked;
    
    let total = selectedCount * moviePrice;
    
    // Day 62: Apply 20% discount if 2+ seats and Promo is ON
    if (isCouple && selectedCount >= 2) {
        total = total * 0.8;
    }

    document.getElementById('total').innerText = total.toFixed(2);
}

function issueReceipt() {
    const selectedNodes = document.querySelectorAll('.seat.selected');
    const isCouple = document.getElementById('coupleToggle').checked;

    if (selectedNodes.length === 0) return alert("Please select seats!");
    if (isCouple && selectedNodes.length < 2) {
        alert("Couple promo requires at least 2 seats!");
        return;
    }

    let selectedIDs = [];
    let occupied = JSON.parse(localStorage.getItem(currentScreen)) || [];

    selectedNodes.forEach(node => {
        selectedIDs.push(node.dataset.id);
        occupied.push(node.dataset.id);
    });

    localStorage.setItem(currentScreen, JSON.stringify(occupied));

    // UI Feedback for Receipt
    const finalPrice = document.getElementById('total').innerText;
    const modalContainer = document.getElementById('modalContainer');
    
    if (isCouple) modalContainer.classList.add('val-receipt');
    else modalContainer.classList.remove('val-receipt');

    document.getElementById('receiptBody').innerHTML = `
        <h2 style="color: ${isCouple ? '#ff4757' : '#333'}">
            ${isCouple ? '💖 VALENTINE PASS' : 'CINEMA RECEIPT'}
        </h2>
        <p><strong>Movie:</strong> ${currentMovie}</p>
        <p><strong>Seats:</strong> ${selectedIDs.join(', ')}</p>
        <hr>
        <p style="font-size: 1.2rem;"><strong>Total: $${finalPrice}</strong></p>
        ${isCouple ? '<div class="popcorn-badge">🍿 FREE LARGE POPCORN VOUCHER</div>' : ''}
        <p style="font-size: 9px; margin-top: 20px;">Ref: ${Math.random().toString(36).substr(2, 5).toUpperCase()}</p>
    `;

    document.getElementById('receiptModal').classList.remove('hidden');
}

function closeReceipt() {
    document.getElementById('receiptModal').classList.add('hidden');
    goBack();
}

function goBack() {
    document.getElementById('lobby').classList.remove('hidden');
    document.getElementById('theater').classList.add('hidden');
    document.getElementById('total').innerText = "0";
}