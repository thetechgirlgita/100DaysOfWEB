
const currentMovie = {
    title: "INTERSTELLAR",
    time: "19:30",
    price: 15.00
};

let bookedSeats = JSON.parse(localStorage.getItem('booked_db')) || [];

function init() {
    const grid = document.getElementById('seatGrid');
    grid.innerHTML = '';
    
    for (let i = 0; i < 40; i++) {
        const seat = document.createElement('div');
        seat.className = bookedSeats.includes(i) ? 'seat occupied' : 'seat';
        
        if (!bookedSeats.includes(i)) {
            seat.onclick = () => {
                seat.classList.toggle('selected');
                updatePrice();
            };
        }
        grid.appendChild(seat);
    }
}

function updatePrice() {
    const count = document.querySelectorAll('.seat.selected').length;
    document.getElementById('totalPrice').innerText = count * currentMovie.price;
}

function issueReceipt() {
    const selectedNodes = document.querySelectorAll('.seat.selected');
    if (selectedNodes.length === 0) return alert("Select seats!");

    const seatNumbers = [];
    const allSeats = document.querySelectorAll('.seat');
    
    selectedNodes.forEach(s => {
        const idx = Array.from(allSeats).indexOf(s);
        seatNumbers.push(idx + 1); 
        bookedSeats.push(idx); // Add to permanent list
    });

    // Save to Local Storage
    localStorage.setItem('booked_db', JSON.stringify(bookedSeats));

    // GENERATE RECEIPT HTML
    const total = seatNumbers.length * currentMovie.price;
    document.getElementById('receiptBody').innerHTML = `
        <div class="receipt-line"><span>MOVIE:</span> <span>${currentMovie.title}</span></div>
        <div class="receipt-line"><span>TIME:</span> <span>${currentMovie.time}</span></div>
        <div class="receipt-line"><span>SEATS:</span> <span>#${seatNumbers.join(', ')}</span></div>
        <hr>
        <div class="receipt-line"><strong>TOTAL:</strong> <strong>$${total.toFixed(2)}</strong></div>
        <p style="font-size: 0.7rem; margin-top: 10px;">ID: ${Date.now().toString().slice(-6)}</p>
    `;

    document.getElementById('receiptModal').classList.remove('hidden');
}

function closeReceipt() {
    document.getElementById('receiptModal').classList.add('hidden');
    init(); // Refresh grid
    updatePrice();
}

init();