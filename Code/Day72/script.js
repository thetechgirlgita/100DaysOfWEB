let tasks = JSON.parse(localStorage.getItem("day72_tasks")) || [];
let showHistory = false;

// 1. Data Persistence
function saveAndRender() {
    localStorage.setItem("day72_tasks", JSON.stringify(tasks));
    render(); updateAnalytics(); analyzeHabits();
}

// 2. Add Task (Combined Logic)
function addTask() {
    const t = document.getElementById('taskInput');
    const d = document.getElementById('dateInput');
    const tm = document.getElementById('timeInput');
    const p = document.getElementById('priorityInput');
    if (!t.value.trim()) return;

    tasks.push({ 
        id: Date.now(), 
        text: t.value, 
        priority: p.value, 
        category: "Custom", 
        completed: false,
        deadline: (d.value && tm.value) ? `${d.value}T${tm.value}` : null
    });
    t.value = ""; d.value = ""; tm.value = "";
    saveAndRender();
}

function addRitual(name, priority, category) {
    tasks.push({ id: Date.now(), text: name, priority, category, completed: false });
    saveAndRender();
}

// 3. Archive & State
function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed, finishedAt: !t.completed ? new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : null } : t);
    saveAndRender();
}

function toggleHistoryView() {
    showHistory = !showHistory;
    const hList = document.getElementById('historyList');
    const btn = document.getElementById('toggleHistory');
    
    hList.classList.toggle('hidden', !showHistory);
    btn.innerText = showHistory ? "Hide Finished Archive" : "View Finished History";
    render();
}

function deleteTask(id) { tasks = tasks.filter(t => t.id !== id); saveAndRender(); }
function clearCompleted() { tasks = tasks.filter(t => !t.completed); saveAndRender(); }

// 4. Render Engine
function render() {
    const list = document.getElementById('taskList'), hList = document.getElementById('historyList');
    list.innerHTML = ""; hList.innerHTML = "";
    tasks.forEach(task => {
        if (!task.completed) {
            const li = document.createElement('li');
            li.className = `task-item priority-${task.priority}`;
            li.innerHTML = `<div onclick="toggleTask(${task.id})">${task.text}</div><span onclick="deleteTask(${task.id})">✕</span>`;
            list.appendChild(li);
        } else if (showHistory) {
            const hi = document.createElement('li');
            hi.className = "history-item";
            hi.innerHTML = `<span>✅ ${task.text}</span><span>${task.finishedAt}</span>`;
            hList.appendChild(hi);
        }
    });
    document.getElementById('taskCount').innerText = `${tasks.filter(t => !t.completed).length} active`;
}

// 5. Analytics & Insights
function updateAnalytics() {
    const total = tasks.length, comp = tasks.filter(t => t.completed).length, p = total === 0 ? 0 : Math.round((comp / total) * 100);
    document.getElementById('statDone').innerText = comp;
    document.getElementById('statPending').innerText = total - comp;
    document.getElementById('progressPercent').innerText = (p === 100 && total > 0) ? "🏆" : `${p}%`;
    document.getElementById('progressCircle').style.background = `conic-gradient(var(--primary) ${(p/100)*360}deg, #333 0deg)`;
}

function analyzeHabits() {
    const comp = tasks.filter(t => t.completed);
    if (comp.length === 0) return;
    const counts = comp.reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + 1; return acc; }, {});
    const top = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    document.getElementById('insightText').innerHTML = `Focusing on <strong>${top}</strong>. Keep it up!`;
}

render(); updateAnalytics(); analyzeHabits();