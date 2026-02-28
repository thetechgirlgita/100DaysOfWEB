let tasks = JSON.parse(localStorage.getItem("day72_tasks")) || [];
let showHistory = false;

// 1. ANALYTICS & INSIGHT ENGINE
function updateAnalytics() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    document.getElementById('statDone').innerText = completed;
    document.getElementById('statPending').innerText = total - completed;
    document.getElementById('progressPercent').innerText = (percentage === 100 && total > 0) ? "🏆" : `${percentage}%`;
    document.getElementById('progressCircle').style.background = `conic-gradient(var(--primary) ${(percentage/100)*360}deg, #333 0deg)`;
}

function analyzeHabits() {
    const completedTasks = tasks.filter(t => t.completed);
    if (completedTasks.length === 0) {
        document.getElementById('insightText').innerText = "Complete your daily rituals to generate insights!";
        return;
    }
    const counts = completedTasks.reduce((acc, t) => { acc[t.category] = (acc[t.category] || 0) + 1; return acc; }, {});
    const top = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    document.getElementById('insightText').innerHTML = `You're crushing it in <strong>${top}</strong>. Stay consistent!`;
}

// 2. CORE FUNCTIONS
function saveAndRender() {
    localStorage.setItem("day72_tasks", JSON.stringify(tasks));
    render();
    updateAnalytics();
    analyzeHabits();
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed, finishedAt: !t.completed ? new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : null } : t);
    saveAndRender();
}

function addRitual(name, priority, category) {
    tasks.push({ id: Date.now(), text: name, deadline: null, priority, category, completed: false });
    saveAndRender();
}

function render() {
    const list = document.getElementById('taskList');
    const historyList = document.getElementById('historyList');
    list.innerHTML = ""; historyList.innerHTML = "";

    tasks.sort((a,b) => (a.completed - b.completed)).forEach(task => {
        if (!task.completed) {
            const li = document.createElement('li');
            li.className = `task-item priority-${task.priority}`;
            li.innerHTML = `<div onclick="toggleTask(${task.id})"><span>${task.text}</span></div>`;
            list.appendChild(li);
        } else if (showHistory) {
            const hi = document.createElement('li');
            hi.className = "history-item";
            hi.innerHTML = `<span>✅ ${task.text}</span><span class="history-time">${task.finishedAt}</span>`;
            historyList.appendChild(hi);
        }
    });
}

function toggleHistoryView() { showHistory = !showHistory; render(); }
render(); updateAnalytics(); analyzeHabits();