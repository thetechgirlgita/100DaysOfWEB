let notes = JSON.parse(localStorage.getItem("day73_notes")) || [];

function addNote() {
    const title = document.getElementById('noteTitle');
    const body = document.getElementById('noteBody');
    if (!title.value && !body.value) return;

    notes.push({ id: Date.now(), title: title.value, body: body.value });
    saveNotes();
    title.value = ""; body.value = "";
}

function saveNotes() {
    localStorage.setItem("day73_notes", JSON.stringify(notes));
    renderNotes();
}

function renderNotes() {
    const grid = document.getElementById('notesGrid');
    grid.innerHTML = "";
    notes.forEach(note => {
        const card = document.createElement('div');
        card.className = "note-card";
        card.innerHTML = `
            <h4>${note.title}</h4>
            <p>${note.body}</p>
            <span class="note-delete" onclick="deleteNote(${note.id})">✕</span>
        `;
        grid.appendChild(card);
    });
}

function deleteNote(id) {
    notes = notes.filter(n => n.id !== id);
    saveNotes();
}

renderNotes();