let tasks = JSON.parse(localStorage.getItem("day69_tasks")) || [];
const alarmSound = document.getElementById('alarmSound');

document.getElementById('dateDisplay').innerText = new Date().toDateString();

// 1. HEARTBEAT ENGINE
setInterval(() => {
    const now = new Date().getTime();
    tasks.forEach(task => {
        if (!task.completed && !task.alarmFired && task.deadline) {
            if (now >= new Date(task.deadline).getTime()) {
                triggerAlarm(task);
            }
        }
    });
    render();
}, 1000);

function triggerAlarm(task) {
    task.alarmFired = true;
    alarmSound.play().catch(() => {});
    alert(`🚨 RITUAL REMINDER: ${task.text}`);
    saveAndRender();
}

// 2. TIME CALCULATIONS
function getRemainingTime(deadline) {
    if (!deadline) return null;
    const diff = new Date(deadline).getTime() - new Date().getTime();
    if (diff <= 0) return "TIME EXPIRED";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h.toString().padStart(2,'0')}h ${m.toString().padStart(2,'0')}m ${s.toString().padStart(2,'0')}s`;
}

// 3. RITUAL INJECTOR (NEW)
function addRitual(name, priority, category) {
    const newTask = {
        id: Date.now(),
        text: name,
        deadline: null, // Rituals are often unscheduled or manually timed later
        priority: priority,
        category: category,
        completed: false,
        alarmFired: false
    };
    tasks.push(newTask);
    saveAndRender();
}

// 4. STANDARD CRUD
function addTask() {
    const tInput = document.getElementById('taskInput');
    const dInput = document.getElementById('dateInput');
    const tmInput = document.getElementById('timeInput');
    const pInput = document.getElementById('priorityInput');

    if (tInput.value.trim() === "") return;

    const newTask = {
        id: Date.now(),
        text: tInput.value,
        deadline: (dInput.value && tmInput.value) ? `${dInput.value}T${tmInput.value}` : null,
        priority: pInput.value,
        category: "Custom",
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
    tasks = tasks.filter(t => !t.completed);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem("day69_tasks", JSON.stringify(tasks));
    render();
}

// 5. RENDER ENGINE
function render() {
    const list = document.getElementById('taskList');
    list.innerHTML = "";

    // Sort: Incomplete first, then by Priority (High > Med > Low)
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    sortedTasks.forEach(task => {
        const isOverdue = !task.completed && task.deadline && new Date(task.deadline) < new Date();
        const countdown = !task.completed ? getRemainingTime(task.deadline) : "DONE ✓";
        
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''} priority-${task.priority}`;
        
        li.innerHTML = `
            <div onclick="toggleTask(${task.id})" style="flex:1">
                <span class="priority-tag tag-${task.priority}">${task.priority}</span>
                <span class="task-text">${task.text}</span>
                <span class="category-badge">[${task.category || 'General'}]</span>
                <div class="deadline-badge">
                    ${isOverdue ? "⚠️ " : "⏳ "}${countdown || "No Schedule"}
                </div>
            </div>
            <span class="delete-btn" onclick="deleteTask(${task.id})">✕</span>
        `;
        list.appendChild(li);
    });

    document.getElementById('taskCount').innerText = `${tasks.filter(t => !t.completed).length} items active`;
}

render();