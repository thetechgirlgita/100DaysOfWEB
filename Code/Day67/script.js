let tasks = JSON.parse(localStorage.getItem("day66_tasks")) || [];
const alarmSound = document.getElementById('alarmSound');

// 1. Initial UI Setup
document.getElementById('dateDisplay').innerText = new Date().toDateString();

// 2. THE HEARTBEAT - CHECKING FOR DEADLINES EVERY SECOND
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
}, 1000);

function triggerAlarm(task) {
    task.alarmFired = true; // Stop repeated alarms
    alarmSound.play().catch(e => console.log("Audio requires interaction first"));
    
    alert(`⏰ TIME UP: ${task.text}`);
    saveAndRender();
}

// 3. TASK LOGIC
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const timeInput = document.getElementById('timeInput');

    if (taskInput.value.trim() === "") return;

    let combinedDeadline = null;
    if (dateInput.value && timeInput.value) {
        combinedDeadline = `${dateInput.value}T${timeInput.value}`;
    }

    const newTask = {
        id: Date.now(),
        text: taskInput.value,
        deadline: combinedDeadline,
        completed: false,
        alarmFired: false
    };

    tasks.push(newTask);
    
    // Clear inputs
    taskInput.value = "";
    dateInput.value = "";
    timeInput.value = "";
    
    saveAndRender();
}

function clearCompleted() {
    //  Filter and re-assign
    tasks = tasks.filter(task => task.completed === false);
    saveAndRender();
}

function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveAndRender();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem("day66_tasks", JSON.stringify(tasks));
    render();
}

function render() {
    const list = document.getElementById('taskList');
    list.innerHTML = "";

    tasks.forEach(task => {
        const isOverdue = !task.completed && task.deadline && new Date(task.deadline) < new Date();
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`;
        
        let displayDate = "No deadline";
        if(task.deadline) {
            const d = new Date(task.deadline);
            displayDate = d.toLocaleDateString() + " " + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }

        li.innerHTML = `
            <div onclick="toggleTask(${task.id})">
                <span class="task-text">${task.text}</span>
                <div class="deadline-badge">⏰ ${displayDate}</div>
            </div>
            <span class="delete-btn" onclick="deleteTask(${task.id})">✕</span>
        `;
        list.appendChild(li);
    });

    document.getElementById('taskCount').innerText = `${tasks.filter(t => !t.completed).length} active`;
}

render();