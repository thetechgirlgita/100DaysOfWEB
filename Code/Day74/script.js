let notes = JSON.parse(localStorage.getItem("day74_notes")) || [];
let selectedColor = '#2d2e30'; // Global tracker for currently picked color

function selectColor(color, element) {
    selectedColor = color;
    // Update Palette UI
    document.querySelectorAll('.color-opt').forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');
    // Change input box color for "Live Preview"
    document.getElementById('inputContainer').style.backgroundColor = color;
}

function addNote() {
    const title = document.getElementById('noteTitle');
    const body = document.getElementById('noteBody');
    
    if (!title.value && !body.value) return;

    const newNote = {
        id: Date.now(),
        title: title.value,
        body: body.value,
        color: selectedColor, // KEY FIX: Store the specific color picked
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    notes.unshift(newNote);
    saveAndRender();
    
    // Reset Everything
    title.value = "";
    body.value = "";
    resetUI();
}

function resetUI() {
    selectedColor = '#2d2e30';
    document.getElementById('inputContainer').style.backgroundColor = selectedColor;
    document.querySelectorAll('.color-opt').forEach(opt => opt.classList.remove('active'));
    document.querySelector('.color-opt').classList.add('active');
}

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
        
        // APPLY THE SAVED COLOR HERE
        card.style.backgroundColor = note.color || '#2d2e30'; 
        
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

// Initial Run
renderNotes();