
// DOM Elements
const createNoteButton = document.getElementById('create-note');
const searchNotesInput = document.getElementById('search-notes');
const labelViewButton = document.getElementById('label-view');
const archivedNotesButton = document.getElementById('archived-notes');
const trashNotesButton = document.getElementById('trash-notes');
const notesContainer = document.getElementById('notes-container');

// Event Listeners
document.addEventListener('DOMContentLoaded', renderNotes);
createNoteButton.addEventListener('click', createNewNote);
searchNotesInput.addEventListener('input', searchNotes);
labelViewButton.addEventListener('click', viewByLabel);
archivedNotesButton.addEventListener('click', viewArchivedNotes);
trashNotesButton.addEventListener('click', viewTrashNotes);

// Functions
function createNewNote() {
    const note = {
        id: Date.now(),
        content: '',
        tags: [],
        archived: false,
        trashed: false,
        backgroundColor: 'white',
        createdAt: new Date()
    };
    saveNoteToStorage(note);
    renderNotes();
}

function saveNoteToStorage(note) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
}

function saveNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function renderNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    renderFilteredNotes(notes.filter(note => !note.trashed));
}

function renderFilteredNotes(notes) {
    notesContainer.innerHTML = '';
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.style.backgroundColor = note.backgroundColor;
        noteElement.dataset.id = note.id;
        noteElement.innerHTML = `
            <input type="text" placeholder="Add tags" value="${note.tags.join(', ')}">
            <textarea>${note.content}</textarea>
            <div>
                <button class="delete-note">Delete</button>
                <button class="archive-note">${note.archived ? 'Unarchive' : 'Archive'}</button>
                <button class="toggle-color">Toggle Color</button>
            </div>
        `;
        notesContainer.appendChild(noteElement);

        // Event listeners for note elements
        noteElement.querySelector('textarea').addEventListener('input', function(e) {
            note.content = e.target.value;
            saveNotes(notes);
        });

        noteElement.querySelector('.delete-note').addEventListener('click', function() {
            note.trashed = true;
            saveNotes(notes);
            renderNotes();
        });

        noteElement.querySelector('.archive-note').addEventListener('click', function() {
            note.archived = !note.archived;
            saveNotes(notes);
            renderNotes();
        });

        noteElement.querySelector('input').addEventListener('input', function(e) {
            note.tags = e.target.value.split(',').map(tag => tag.trim());
            saveNotes(notes);
        });

        noteElement.querySelector('.toggle-color').addEventListener('click', function() {
            const colors = ['white', 'yellow', 'lightblue', 'lightgreen', 'lightpink','grey','orange','purple','cyan','violet','black'];
            const currentColorIndex = colors.indexOf(note.backgroundColor);
            const nextColorIndex = (currentColorIndex + 1) % colors.length;
            note.backgroundColor = colors[nextColorIndex];
            saveNotes(notes);
            renderNotes();
        });
    });
}

function searchNotes(e) {
    const query = e.target.value.toLowerCase();
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const filteredNotes = notes.filter(note => note.content.toLowerCase().includes(query) && !note.trashed);
    renderFilteredNotes(filteredNotes);
}

function viewByLabel() {
    const label = prompt('Enter the label to view:');
    if (label) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const filteredNotes = notes.filter(note => note.tags.includes(label) && !note.trashed);
        renderFilteredNotes(filteredNotes);
    }
}

function viewArchivedNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const archivedNotes = notes.filter(note => note.archived && !note.trashed);
    renderFilteredNotes(archivedNotes);
}

function viewTrashNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const trashNotes = notes.filter(note => note.trashed && isWithinLast30Days(note.createdAt));
    renderFilteredNotes(trashNotes);
}


document.getElementById('archived-notes').addEventListener('click', function() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const archivedNotes = notes.filter(note => note.archived && !note.trashed);
    renderFilteredNotes(archivedNotes);
});

function isWithinLast30Days(date) {
    const now = new Date();
    const noteDate = new Date(date);
    const differenceInTime = now - noteDate;
    return differenceInTime <= 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
}
