const seatGrid = document.getElementById('seatGrid');
const count = document.getElementById('count');
const total = document.getElementById('total');
const ticketPrice = 15;

// 1. Initialize Seats (8x6 grid = 48 seats)
function initSeats() {
    // Load occupied seats from local storage
    const occupiedSeats = JSON.parse(localStorage.getItem('occupiedSeats')) || [];

    for (let i = 0; i < 48; i++) {
        const seat = document.createElement('div');
        seat.classList.add('seat');
        
        // If seat index is in our "occupied" database, mark it
        if (occupiedSeats.includes(i)) {
            seat.classList.add('occupied');
        }

        seat.addEventListener('click', () => toggleSeat(seat, i));
        seatGrid.appendChild(seat);
    }
}

// 2. Handle Seat Selection
function toggleSeat(seat, index) {
    if (!seat.classList.contains('occupied')) {
        seat.classList.toggle('selected');
        updateSummary();
    }
}

// 3. Update UI Text
function updateSummary() {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    const selectedCount = selectedSeats.length;
    count.innerText = selectedCount;
    total.innerText = selectedCount * ticketPrice;
}

// 4. Save to LocalStorage 
function confirmBooking() {
    const selectedSeats = document.querySelectorAll('.seat.selected');
    
    if (selectedSeats.length === 0) {
        alert("Please select a seat first!");
        return;
    }

    // Get current occupied seats
    let occupied = JSON.parse(localStorage.getItem('occupiedSeats')) || [];

    // Find the index of newly selected seats
    const allSeats = document.querySelectorAll('.seat');
    selectedSeats.forEach(seat => {
        const index = [...allSeats].indexOf(seat);
        occupied.push(index);
        seat.classList.remove('selected');
        seat.classList.add('occupied');
    });

    // Save back to storage
    localStorage.setItem('occupiedSeats', JSON.stringify(occupied));
    updateSummary();
    alert("Tickets Booked Successfully!");
}

initSeats();