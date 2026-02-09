// --- VIEW CONTROLLER ---
function showTab(type) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');

    if (type === 'signup') {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
    } else {
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
    }
}

// --- CORE AUTH LOGIC ---

// Helper: Get users from LocalStorage
function getUsers() {
    const data = localStorage.getItem('users_db');
    return data ? JSON.parse(data) : [];
}

// 1. SIGN UP
function handleSignup() {
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const pass = document.getElementById('signupPass').value;
    const msg = document.getElementById('signupMsg');

    let users = getUsers();

    // Check if email exists
    if (users.find(u => u.email === email)) {
        msg.className = "message error";
        msg.innerText = "Email already registered!";
        return;
    }

    // Save New User
    users.push({ name, email, pass });
    localStorage.setItem('users_db', JSON.stringify(users));

    msg.className = "message success";
    msg.innerText = "Account created! You can now login.";
    setTimeout(() => showTab('login'), 1500);
}

// 2. LOGIN
function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    const msg = document.getElementById('loginMsg');

    const users = getUsers();
    const user = users.find(u => u.email === email && u.pass === pass);

    if (user) {
        // Create session
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('activeUser', user.name);
        checkSession();
    } else {
        msg.className = "message error";
        msg.innerText = "Invalid email or password.";
    }
}

// 3. SESSION CHECK
function checkSession() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const activeUser = localStorage.getItem('activeUser');

    if (isLoggedIn === 'true') {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('signupForm').classList.add('hidden');
        document.querySelector('.tabs').classList.add('hidden');
        document.getElementById('welcomeState').classList.remove('hidden');
        document.getElementById('userName').innerText = activeUser;
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('activeUser');
    window.location.reload();
}

// Run on page load
window.onload = checkSession;