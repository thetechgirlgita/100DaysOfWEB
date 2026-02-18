// Load tasks from LocalStorage or start with empty array
let tasks = JSON.parse(localStorage.getItem("day65_tasks")) || [];

// Display current date on load
document.getElementById('dateDisplay').innerText = new Date().toDateString();

/**
 * Adds a new task object to the array
 */
function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();

    if (text === "") return;

    const newTask = {
        id: Date.now(), // Unique ID based on time
        text: text,
        completed: false
    };

    tasks.push(newTask);
    input.value = ""; // Clear input
    saveAndRender();
}

/**
 * Swaps the completed status of a task
 */
function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveAndRender();
}

/**
 * Removes a task from the array
 */
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveAndRender();
}

/**
 * Removes all finished tasks
 */
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveAndRender();
}

/**
 * Updates LocalStorage and refreshes the UI
 */
function saveAndRender() {
    localStorage.setItem("day65_tasks", JSON.stringify(tasks));
    render();
}

/**
 * Builds the HTML list items based on the tasks array
 */
function render() {
    const list = document.getElementById('taskList');
    list.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <span onclick="toggleTask(${task.id})">${task.text}</span>
            <span class="delete-btn" onclick="deleteTask(${task.id})">✕</span>
        `;
        
        list.appendChild(li);
    });

    // Update the counter
    const activeCount = tasks.filter(t => !t.completed).length;
    document.getElementById('taskCount').innerText = `${activeCount} tasks left`;
}

// Support for "Enter" key to add task
document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Initial draw
render();