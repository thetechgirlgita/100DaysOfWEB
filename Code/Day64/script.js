// --- CONFIGURATION ---
let currentScreen = "";
let currentMovie = "";
let moviePrice = 0;
const rowLetters = ['A', 'B', 'C', 'D', 'E'];
const ADMIN_PIN = "2026";

/**
 * 1. LOBBY NAVIGATION
 * Opens the theater view and resets the state for the specific screen.
 */
function openTheater(screen, title, price) {
    currentScreen = screen;
    currentMovie = title;
    moviePrice = price;
    
    document.getElementById('lobby').classList.add('hidden');
    document.getElementById('theater').classList.remove('hidden');
    document.getElementById('activeMovie').innerText = `${title} (${screen})`;
    
    // Hard Reset: Clears selection and price from previous session
    document.getElementById('total').innerText = "0.00";
    
    renderSeats();
}

/**
 * 2. SEAT RENDERING
 * Generates the 40-seat grid and checks LocalStorage for sold seats.
 */
function renderSeats() {
    const grid = document.getElementById('seatGrid');
    grid.innerHTML = "";
    
    // Load booked seats for the active screen
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

/**
 * 3. PRICE CALCULATION
 * Uses a specific selector to avoid counting legend seats.
 */
function updateTotal() {
    const selectedSeats = document.querySelectorAll('#seatGrid .seat.selected');
    const count = selectedSeats.length;
    document.getElementById('total').innerText = (count * moviePrice).toFixed(2);
}

/**
 * 4. BOOKING & REVENUE LOGIC
 * Saves the data to LocalStorage and updates the financial ledger.
 */
function issueReceipt() {
    const selectedNodes = document.querySelectorAll('#seatGrid .seat.selected');
    
    if (selectedNodes.length === 0) {
        return alert("Please select seats before confirming.");
    }

    let selectedIDs = Array.from(selectedNodes).map(n => n.dataset.id);
    let totalPaid = parseFloat(document.getElementById('total').innerText);
    
    // Update Occupied Seats in LocalStorage
    let occupied = JSON.parse(localStorage.getItem(currentScreen)) || [];
    occupied.push(...selectedIDs);
    localStorage.setItem(currentScreen, JSON.stringify(occupied));

    // Update Revenue Ledger in LocalStorage
    let currentRevenue = parseFloat(localStorage.getItem(currentScreen + "_revenue")) || 0;
    localStorage.setItem(currentScreen + "_revenue", (currentRevenue + totalPaid).toFixed(2));

    // Trigger the Display
    renderReceipt(selectedIDs, totalPaid);
}

/**
 * 5. RECEIPT RENDERING (The missing piece!)
 * Populates the modal with transaction data.
 */
function renderReceipt(seats, total) {
    const receiptBody = document.getElementById('receiptBody');
    const modal = document.getElementById('receiptModal');

    receiptBody.innerHTML = `
        <h2 style="margin-top:0; color: #222; border-bottom: 2px solid #eee; padding-bottom:10px;">CINE-LOCAL</h2>
        <p><strong>Movie:</strong> ${currentMovie}</p>
        <p><strong>Hall:</strong> ${currentScreen}</p>
        <p><strong>Seats:</strong> ${seats.join(', ')}</p>
        <hr style="border: 1px dashed #ddd; margin: 15px 0;">
        <p style="font-size: 1.3rem; color: #2ecc71;"><strong>TOTAL PAID: $${total.toFixed(2)}</strong></p>
        <div style="margin-top:20px; font-size:10px; color:#999;">
            TIMESTAMP: ${new Date().toLocaleString()}<br>
            TRANS-ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}
        </div>
    `;

    modal.classList.remove('hidden');
}

/**
 * 6. ADMIN & STATS
 * Secure access to financial data and screen resets.
 */
function toggleRevenue() {
    const pin = prompt("Enter Manager PIN to view earnings:");
    if (pin === ADMIN_PIN) {
        const revDisplay = document.getElementById('revenueDisplay');
        const totalEarned = localStorage.getItem(currentScreen + "_revenue") || "0.00";
        
        revDisplay.innerText = `Screen Revenue: $${totalEarned}`;
        revDisplay.classList.toggle('hidden');
    } else if (pin !== null) {
        alert("ACCESS DENIED: Unauthorized attempt.");
    }
}

function adminReset() {
    const pin = prompt("Admin Authorization Required:");
    if (pin === ADMIN_PIN) {
        if (confirm("DANGER: This will wipe all bookings and revenue for " + currentScreen + ". Proceed?")) {
            localStorage.removeItem(currentScreen);
            localStorage.removeItem(currentScreen + "_revenue");
            
            // Hide stats and refresh
            if(document.getElementById('revenueDisplay')) {
                document.getElementById('revenueDisplay').classList.add('hidden');
            }
            renderSeats();
            updateTotal();
            alert("System Purged.");
        }
    } else if (pin !== null) {
        alert("Invalid PIN.");
    }
}

/**
 * 7. UTILITIES
 */
function goBack() {
    document.getElementById('lobby').classList.remove('hidden');
    document.getElementById('theater').classList.add('hidden');
}

function closeReceipt() {
    document.getElementById('receiptModal').classList.add('hidden');
    goBack(); // Auto-return to lobby for the next customer
}