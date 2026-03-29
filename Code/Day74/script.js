let notes = JSON.parse(localStorage.getItem("day74_notes")) || [];
let selectedColor = '#2d2e30'; 

// 1. Color Selection Logic
function selectColor(color, element) {
    selectedColor = color;
    
    // Update active circle UI
    document.querySelectorAll('.color-opt').forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');
    
    // Live preview for the input box
    document.getElementById('inputContainer').style.backgroundColor = color;
}

// 2. Add Note Logic
function addNote() {
    const titleInput = document.getElementById('noteTitle');
    const bodyInput = document.getElementById('noteBody');
    
    if (!titleInput.value && !bodyInput.value) return;

    const newNote = {
        id: Date.now(),
        title: titleInput.value,
        body: bodyInput.value,
        color: selectedColor,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    notes.unshift(newNote); // Put newest at the top
    saveAndRender();
    
    // Reset Input
    titleInput.value = "";
    bodyInput.value = "";
    resetPalette();
}

function resetPalette() {
    selectedColor = '#2d2e30';
    const container = document.getElementById('inputContainer');
    container.style.backgroundColor = selectedColor;
    
    document.querySelectorAll('.color-opt').forEach(opt => opt.classList.remove('active'));
    document.querySelector('.color-opt').classList.add('active'); // Set first dot to active
}

// 3. Persistence & Rendering
function saveAndRender() {
    localStorage.setItem("day74_notes", JSON.stringify(notes));
    renderNotes();
}

function renderNotes() {
    const grid = document.getElementById('notesGrid');
    grid.innerHTML = "";

    notes.forEach(note => {
        const card = document.createElement('div');
        card.className = "note-card";
        
        // Apply the saved color directly to the card
        card.style.backgroundColor = note.color;
        
        card.innerHTML = `
            ${note.title ? `<h4>${note.title}</h4>` : ''}
            <p>${note.body}</p>
            <div class="meta">${note.time}</div>
            <span class="note-delete" onclick="deleteNote(${note.id})">✕</span>
        `;
        grid.appendChild(card);
    });
}

function deleteNote(id) {
    notes = notes.filter(n => n.id !== id);
    saveAndRender();
}

// Initial render call
renderNotes();