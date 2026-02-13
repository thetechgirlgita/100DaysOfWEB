// --- INITIAL STATE ---
let cinemaDB = {
    movie: "Interstellar",
    price: 15,
    bookedSeats: [], // Array of seat indexes
    revenue: 0
};

// --- CORE FUNCTIONS ---

function init() {
    const savedData = localStorage.getItem('cine_local_data');
    if (savedData) {
        cinemaDB = JSON.parse(savedData);
    }
    renderSeating();
    updateStats();
}

function renderSeating() {
    document.getElementById('displayTitle').innerText = cinemaDB.movie;
    document.getElementById('displayPrice').innerText = cinemaDB.price;
    
    const grid = document.getElementById('seatingPlan');
    grid.innerHTML = ''; // Clear current grid

    // Generate 40 seats
    for (let i = 0; i < 40; i++) {
        const seat = document.createElement('div');
        const isOccupied = cinemaDB.bookedSeats.includes(i);
        
        seat.className = isOccupied ? 'seat occupied' : 'seat available';
        
        if (!isOccupied) {
            seat.onclick = () => {
                seat.classList.toggle('selected');
                calculatePrice();
            };
        }
        grid.appendChild(seat);
    }
}

function calculatePrice() {
    const selected = document.querySelectorAll('.seat.selected').length;
    document.getElementById('selectedCount').innerText = selected;
    document.getElementById('totalPrice').innerText = selected * cinemaDB.price;
}

function processPayment() {
    const selectedNodes = document.querySelectorAll('.seat.selected');
    if (selectedNodes.length === 0) return alert("Select seats first!");

    const allSeats = document.querySelectorAll('.seat');
    const newBookings = [];

    selectedNodes.forEach(node => {
        const index = Array.from(allSeats).indexOf(node);
        cinemaDB.bookedSeats.push(index);
        cinemaDB.revenue += cinemaDB.price;
    });

    saveData();
    alert("Booking Confirmed!");
}

function updateCinema() {
    const title = document.getElementById('inputTitle').value;
    const price = document.getElementById('inputPrice').value;

    if (title) cinemaDB.movie = title;
    if (price) cinemaDB.price = parseInt(price);
    
    // Clear seats for new movie
    cinemaDB.bookedSeats = [];
    cinemaDB.revenue = 0;

    saveData();
    alert("System Updated for new Movie!");
}

function updateStats() {
    document.getElementById('revenue').innerText = `$${cinemaDB.revenue.toFixed(2)}`;
    document.getElementById('occupancy').innerText = `${cinemaDB.bookedSeats.length} / 40`;
}

function saveData() {
    localStorage.setItem('cine_local_data', JSON.stringify(cinemaDB));
    renderSeating();
    updateStats();
    calculatePrice();
}

function switchView(view) {
    document.getElementById('bookingView').classList.toggle('hidden', view !== 'booking');
    document.getElementById('managerView').classList.toggle('hidden', view !== 'manager');
}

function wipeAllData() {
    if (confirm("Delete all sales and seats?")) {
        localStorage.removeItem('cine_local_data');
        location.reload();
    }
}

// Start app
init();