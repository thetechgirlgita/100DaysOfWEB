let notes = JSON.parse(localStorage.getItem("day75_notes")) || [];
let selectedColor = '#2d2e30';

// 1. Filter Logic
function filterNotes() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    
    // Filter by title OR body content
    const filteredResults = notes.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.body.toLowerCase().includes(query)
    );

    renderNotes(filteredResults);
}

// 2. Note Creation
function selectColor(color, element) {
    selectedColor = color;
    document.querySelectorAll('.color-opt').forEach(opt => opt.classList.remove('active'));
    element.classList.add('active');
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
        color: selectedColor,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    notes.unshift(newNote);
    saveAndRender();
    
    title.value = ""; body.value = "";
    resetUI();
}

function resetUI() {
    selectedColor = '#2d2e30';
    document.getElementById('inputContainer').style.backgroundColor = selectedColor;
    document.querySelectorAll('.color-opt').forEach(opt => opt.classList.remove('active'));
    document.querySelector('.color-opt').classList.add('active');
}

// 3. Render Engine ( accepts custom data arrays)
function saveAndRender() {
    localStorage.setItem("day74_notes", JSON.stringify(notes));
    renderNotes();
}

function renderNotes(dataToDisplay = notes) {
    const grid = document.getElementById('notesGrid');
    grid.innerHTML = "";

    if (dataToDisplay.length === 0) {
        grid.innerHTML = `<div class="no-results">No notes found matching your search.</div>`;
        return;
    }

    dataToDisplay.forEach(note => {
        const card = document.createElement('div');
        card.className = "note-card";
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

// Load notes on startup
renderNotes();