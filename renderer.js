document.getElementById('minimize-btn').addEventListener('click', () => {
    window.electronAPI.minimizeWindow();
  });
  
  document.getElementById('maximize-btn').addEventListener('click', () => {
      window.electronAPI.maximizeWindow();
    });
  document.getElementById('close-btn').addEventListener('click', () => {
    window.electronAPI.closeWindow();
  });
  
//   document.getElementById('action1').addEventListener('click', () => {
//     alert('You did something fun!');
//   });
  
//   document.getElementById('action2').addEventListener('click', () => {
//     document.querySelector('.mascot img').classList.add('spin');
//     setTimeout(() => {
//       document.querySelector('.mascot img').classList.remove('spin');
//     }, 1000);
//   });
  
  // Add this to styles.css for the spin animation
  /*
  .spin {
    animation: spin 1s linear;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  */
 // Utility Functions
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getRandomPastelColor() {
  const pastelColors = [
    '#FFD1DC', '#FFEBCD', '#E6E6FA', 
    '#F0FFF0', '#F0FFFF', '#FDF5E6'
  ];
  return pastelColors[Math.floor(Math.random() * pastelColors.length)];
}

// DOM Elements
const noteForm = document.getElementById('note-form');
const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');
const notesList = document.getElementById('notes-list');
const searchInput = document.getElementById('search-input');
const modalOverlay = document.getElementById('modal-overlay');
const editModalOverlay = document.getElementById('edit-modal-overlay');
const deleteModalOverlay = document.getElementById('delete-modal-overlay');

// Edit Modal Elements
const editNoteId = document.getElementById('edit-note-id');
const editNoteTitle = document.getElementById('edit-note-title');
const editNoteContent = document.getElementById('edit-note-content');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  loadNotes();
  
  // Create Note Form Submission
  noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = noteTitle.value.trim();
    const content = noteContent.value.trim();
    
    if (title && content) {
      try {
        await createNote(title, content);
        noteTitle.value = '';
        noteContent.value = '';
        loadNotes();
        closeModal();
      } catch (error) {
        console.error('Error creating note:', error);
      }
    }
  });

  // Search Notes
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    filterNotes(searchTerm);
  });
});

// CRUD Operations
async function createNote(title, content) {
  const note = {
    id: generateUniqueId(),
    title: title,
    content: content,
    color: getRandomPastelColor(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  try {
    await window.electronAPI.createNote(note);
  } catch (error) {
    console.error('Failed to create note:', error);
  }
}

async function loadNotes() {
  try {
    const notes = await window.electronAPI.loadNotes();
    renderNotes(notes);
  } catch (error) {
    console.error('Failed to load notes:', error);
  }
}

function renderNotes(notes) {
  notesList.innerHTML = ''; // Clear existing notes
  
  notes.forEach(note => {
    const noteElement = document.createElement('div');
    noteElement.className = 'note-card';
    noteElement.style.backgroundColor = note.color;
    noteElement.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <div class="note-actions">
        <button onclick="openEditModal('${note.id}', '${note.title}', \`${note.content}\`)">
          ✏️ Edit
        </button>
        <button onclick="openDeleteModal('${note.id}')">
          🗑️ Delete
        </button>
      </div>
    `;
    
    notesList.appendChild(noteElement);
  });
}

function filterNotes(searchTerm) {
  const noteCards = document.querySelectorAll('.note-card');
  
  noteCards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const content = card.querySelector('p').textContent.toLowerCase();
    
    if (title.includes(searchTerm) || content.includes(searchTerm)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Modal Functions
function openCreateModal() {
  modalOverlay.style.display = 'flex';
}

function closeModal() {
  modalOverlay.style.display = 'none';
  editModalOverlay.style.display = 'none';
  deleteModalOverlay.style.display = 'none';
}

// Edit Note Functions
function openEditModal(id, title, content) {
  editNoteId.value = id;
  editNoteTitle.value = title;
  editNoteContent.value = content;
  editModalOverlay.style.display = 'flex';
}

async function updateNote() {
  const id = editNoteId.value;
  const title = editNoteTitle.value.trim();
  const content = editNoteContent.value.trim();
  
  if (title && content) {
    try {
      await window.electronAPI.updateNote(id, { title, content });
      loadNotes();
      closeModal();
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  }
}

// Delete Note Functions
function openDeleteModal(id) {
  const deleteConfirmButton = document.getElementById('delete-confirm');
  deleteConfirmButton.onclick = () => deleteNote(id);
  deleteModalOverlay.style.display = 'flex';
}

async function deleteNote(id) {
  try {
    await window.electronAPI.deleteNote(id);
    loadNotes();
    closeModal();
  } catch (error) {
    console.error('Failed to delete note:', error);
  }
}