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
    
    // Hard Reset UI
    document.getElementById('coupleToggle').checked = false;
    document.getElementById('total').innerText = "0";
    document.getElementById('errorCard').classList.add('hidden');
    
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
            seat.onclick = function() {
                this.classList.toggle('selected');
                checkPromoEligibility(); 
                updateTotal();
            };
        }
        grid.appendChild(seat);
    }
}

function showError() {
    const card = document.getElementById('errorCard');
    card.classList.remove('hidden');
    setTimeout(() => { card.classList.add('hidden'); }, 4000);
}

function checkPromoEligibility() {
    const selectedCount = document.querySelectorAll('#seatGrid .seat.selected').length;
    const coupleToggle = document.getElementById('coupleToggle');

    // If promo is toggled but you only have 1 or 0 seats
    if (coupleToggle.checked && selectedCount < 2) {
        showError();
        coupleToggle.checked = false;
    }
}

function handleToggleClick() {
    checkPromoEligibility();
    updateTotal();
}

function updateTotal() {
    const selectedCount = document.querySelectorAll('#seatGrid .seat.selected').length;
    const isCouple = document.getElementById('coupleToggle').checked;
    
    let total = selectedCount * moviePrice;
    
    if (isCouple && selectedCount >= 2) {
        total = total * 0.8;
    }

    document.getElementById('total').innerText = total.toFixed(2);
}

function issueReceipt() {
    const selectedNodes = document.querySelectorAll('#seatGrid .seat.selected');
    const isCouple = document.getElementById('coupleToggle').checked;

    if (selectedNodes.length === 0) return alert("Select a seat!");

    if (isCouple && selectedNodes.length < 2) {
        showError();
        document.getElementById('coupleToggle').checked = false;
        updateTotal();
        return;
    }

    let selectedIDs = Array.from(selectedNodes).map(node => node.dataset.id);
    let occupied = JSON.parse(localStorage.getItem(currentScreen)) || [];
    occupied.push(...selectedIDs);
    localStorage.setItem(currentScreen, JSON.stringify(occupied));

    const modal = document.getElementById('modalContainer');
    if (isCouple) modal.classList.add('val-receipt');
    else modal.classList.remove('val-receipt');

    document.getElementById('receiptBody').innerHTML = `
        <h2 style="color:${isCouple ? '#ff4757' : '#333'}">${isCouple ? '💖 VALENTINE PASS' : 'TICKET'}</h2>
        <p><strong>Movie:</strong> ${currentMovie}</p>
        <p><strong>Seats:</strong> ${selectedIDs.join(', ')}</p>
        <hr>
        <p><strong>Total: $${document.getElementById('total').innerText}</strong></p>
        ${isCouple ? '<div class="popcorn-badge">🍿 FREE POPCORN INCLUDED</div>' : ''}
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
}