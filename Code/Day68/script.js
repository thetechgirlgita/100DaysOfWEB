let tasks = JSON.parse(localStorage.getItem("day67_tasks")) || [];
const alarmSound = document.getElementById('alarmSound');

document.getElementById('dateDisplay').innerText = new Date().toDateString();

// --- 1. (Refreshes every 1 second) ---
setInterval(() => {
    const now = new Date().getTime();
    
    tasks.forEach(task => {
        if (!task.completed && !task.alarmFired && task.deadline) {
            const deadlineTime = new Date(task.deadline).getTime();
            if (now >= deadlineTime) {
                triggerAlarm(task);
            }
        }
    });

    // Re-render to update the ticking countdown numbers
    render(); 
}, 1000);

function triggerAlarm(task) {
    task.alarmFired = true;
    alarmSound.play().catch(() => console.log("User interaction needed for audio"));
    alert(`⏰ TIME UP: ${task.text}`);
    saveAndRender();
}

// --- 2. TIME CALCULATIONS ---
function getRemainingTime(deadline) {
    if (!deadline) return null;
    
    const now = new Date().getTime();
    const diff = new Date(deadline).getTime() - now;
    
    if (diff <= 0) return "TIME EXPIRED";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    // Formats to 00h 00m 00s
    return `${hours.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
}

// --- 3. CRUD LOGIC ---
function addTask() {
    const tInput = document.getElementById('taskInput');
    const dInput = document.getElementById('dateInput');
    const tmInput = document.getElementById('timeInput');

    if (tInput.value.trim() === "") return;

    let deadline = null;
    if (dInput.value && tmInput.value) {
        deadline = `${dInput.value}T${tmInput.value}`;
    }

    const newTask = {
        id: Date.now(),
        text: tInput.value,
        deadline: deadline,
        completed: false,
        alarmFired: false
    };

    tasks.push(newTask);
    tInput.value = ""; dInput.value = ""; tmInput.value = "";
    saveAndRender();
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
}

function clearCompleted() {
    tasks = tasks.filter(t => t.completed === false);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem("day67_tasks", JSON.stringify(tasks));
    render();
}

// --- 4. RENDER ENGINE ---
function render() {
    const list = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    
    
    list.innerHTML = "";

    tasks.forEach(task => {
        const isOverdue = !task.completed && task.deadline && new Date(task.deadline) < new Date();
        const countdownText = !task.completed ? getRemainingTime(task.deadline) : "Finished ✓";
        
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`;
        
        li.innerHTML = `
            <div onclick="toggleTask(${task.id})" style="flex:1">
                <span class="task-text">${task.text}</span>
                <div class="deadline-badge">
                    ${isOverdue ? "⚠️ " : " "}${countdownText || "No Deadline"}
                </div>
            </div>
            <span class="delete-btn" onclick="deleteTask(${task.id})">✕</span>
        `;
        list.appendChild(li);
    });

    taskCount.innerText = `${tasks.filter(t => !t.completed).length} active`;
}

// Initial render
render();