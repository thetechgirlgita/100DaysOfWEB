let tasks = JSON.parse(localStorage.getItem("day71_tasks")) || [];
let showHistory = false;
const alarmSound = document.getElementById('alarmSound');

document.getElementById('dateDisplay').innerText = new Date().toDateString();

// 1. HEARTBEAT (Every second)
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
    alert(`🚨 TIME FOR: ${task.text}`);
    saveAndRender();
}

// 2. ANALYTICS
function updateAnalytics() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    document.getElementById('statDone').innerText = completed;
    document.getElementById('statPending').innerText = total - completed;
    document.getElementById('progressPercent').innerText = (percentage === 100 && total > 0) ? "🏆" : `${percentage}%`;

    const degrees = (percentage / 100) * 360;
    document.getElementById('progressCircle').style.background = `conic-gradient(var(--primary) ${degrees}deg, #333 ${degrees}deg)`;
}

// 3. DAY 71: HISTORY TOGGLE
function toggleHistoryView() {
    showHistory = !showHistory;
    document.getElementById('toggleHistory').innerText = showHistory ? "Hide Finished Archive" : "View Finished History";
    render();
}

// 4. CRUD OPERATIONS
function addRitual(name, priority, category) {
    tasks.push({ id: Date.now(), text: name, deadline: null, priority, category, completed: false, alarmFired: false });
    saveAndRender();
}

function addTask() {
    const tIn = document.getElementById('taskInput');
    const dIn = document.getElementById('dateInput');
    const tmIn = document.getElementById('timeInput');
    const pIn = document.getElementById('priorityInput');

    if (tIn.value.trim() === "") return;

    tasks.push({
        id: Date.now(),
        text: tIn.value,
        deadline: (dIn.value && tmIn.value) ? `${dIn.value}T${tmIn.value}` : null,
        priority: pIn.value,
        category: "Custom",
        completed: false,
        alarmFired: false
    });

    tIn.value = ""; dIn.value = ""; tmIn.value = "";
    saveAndRender();
}

function toggleTask(id) {
    tasks = tasks.map(t => {
        if (t.id === id) {
            const isDone = !t.completed;
            return { 
                ...t, 
                completed: isDone,
                finishedAt: isDone ? new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : null 
            };
        }
        return t;
    });
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
    localStorage.setItem("day71_tasks", JSON.stringify(tasks));
    render();
    updateAnalytics();
}

// 5. RENDER ENGINE (Segmented)
function render() {
    const list = document.getElementById('taskList');
    const historyList = document.getElementById('historyList');
    list.innerHTML = "";
    historyList.innerHTML = "";

    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const sorted = [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    sorted.forEach(task => {
        if (!task.completed) {
            // Render to Main List
            const isOverdue = task.deadline && new Date(task.deadline) < new Date();
            const diff = task.deadline ? new Date(task.deadline).getTime() - new Date().getTime() : null;
            let countdown = "No Schedule";
            if (diff && diff > 0) {
                const h = Math.floor(diff/3600000); const m = Math.floor((diff%3600000)/60000); const s = Math.floor((diff%60000)/1000);
                countdown = `${h}h ${m}m ${s}s`;
            } else if (diff !== null) countdown = "TIME EXPIRED";

            const li = document.createElement('li');
            li.className = `task-item ${isOverdue ? 'overdue' : ''} priority-${task.priority}`;
            li.innerHTML = `
                <div onclick="toggleTask(${task.id})" style="flex:1">
                    <span class="priority-tag tag-${task.priority}">${task.priority}</span>
                    <span class="task-text">${task.text}</span>
                    <div class="deadline-badge">⏳ ${countdown}</div>
                </div>
                <span class="delete-btn" onclick="deleteTask(${task.id})">✕</span>`;
            list.appendChild(li);
        } else if (showHistory) {
            // Render to History Archive
            const hi = document.createElement('li');
            hi.className = "history-item";
            hi.innerHTML = `
                <span>✅ ${task.text} <small>(${task.category})</small></span>
                <span class="history-time">Finished at ${task.finishedAt}</span>`;
            historyList.appendChild(hi);
        }
    });

    historyList.classList.toggle('hidden', !showHistory);
    document.getElementById('taskCount').innerText = `${tasks.filter(t => !t.completed).length} active missions`;
}

render();
updateAnalytics();