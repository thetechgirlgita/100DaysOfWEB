// --- DAY 67: LIVE COUNTDOWN LOGIC ---

// 1. Update the Heartbeat to also refresh the UI
setInterval(() => {
    const now = new Date().getTime();
    
    tasks.forEach(task => {
        // Alarm logic (from Day 66)
        if (!task.completed && !task.alarmFired && task.deadline) {
            const deadlineTime = new Date(task.deadline).getTime();
            if (now >= deadlineTime) {
                triggerAlarm(task);
            }
        }
    });

    // NEW: Refresh the UI every second to update countdown numbers
    render(); 
}, 1000);

function getRemainingTime(deadline) {
    if (!deadline) return null;
    
    const now = new Date().getTime();
    const t = new Date(deadline).getTime() - now;
    
    if (t <= 0) return "TIME UP";

    const hours = Math.floor((t / (1000 * 60 * 60)));
    const minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((t % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
}

function render() {
    const list = document.getElementById('taskList');
    list.innerHTML = "";

    tasks.forEach(task => {
        const isOverdue = !task.completed && task.deadline && new Date(task.deadline) < new Date();
        const countdown = !task.completed ? getRemainingTime(task.deadline) : "Completed";
        
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`;
        
        li.innerHTML = `
            <div onclick="toggleTask(${task.id})">
                <span class="task-text">${task.text}</span>
                <div class="deadline-badge">
                    ${isOverdue ? "⚠️ Overdue" : "⏳ " + (countdown || "No deadline")}
                </div>
            </div>
            <span class="delete-btn" onclick="deleteTask(${task.id})">✕</span>
        `;
        list.appendChild(li);
    });

    document.getElementById('taskCount').innerText = `${tasks.filter(t => !t.completed).length} active`;
}