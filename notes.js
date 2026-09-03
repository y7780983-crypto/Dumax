// Notes System
// توجه: ابتدای این فایل (تعریف let NOTES_DATA، let currentNoteId،
// رویداد DOMContentLoaded و شروع تابع initNotes تا رویداد addNoteBtn)
// در متن ارسالی شما وجود نداشت. ادامه از همان‌جایی که ارسال شده آمده است.

        openNoteModal();
    });

    document.getElementById('saveNoteBtn').addEventListener('click', saveNote);
    document.getElementById('deleteNoteBtn').addEventListener('click', deleteNote);
    document.getElementById('closeNoteModal').addEventListener('click', () => {
        document.getElementById('noteModal').classList.remove('active');
    });

    document.getElementById('noteSearch').addEventListener('input', (e) => {
        filterNotes(e.target.value);
    });

    document.querySelectorAll('.note-filters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.note-filters .filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterNotes(document.getElementById('noteSearch').value);
        });
    });

    // Close modal on outside click
    document.getElementById('noteModal').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            document.getElementById('noteModal').classList.remove('active');
        }
    });
}

function loadNotes() {
    try {
        const data = localStorage.getItem('dumax_notes');
        if (data) {
            NOTES_DATA = JSON.parse(data);
        } else {
            // Sample notes
            NOTES_DATA = [
                {
                    id: '1',
                    title: 'خوش آمدید به DUMAX',
                    content: 'به اپلیکیشن DUMAX خوش آمدید. این یک یادداشت نمونه است.',
                    color: '#6C63FF',
                    pinned: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: '2',
                    title: 'یادداشت جدید',
                    content: 'شما می‌توانید یادداشت‌های خود را در اینجا بنویسید.',
                    color: '#FF6584',
                    pinned: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ];
            saveNotes();
        }
    } catch (e) {
        console.error('Error loading notes:', e);
    }
}

function saveNotes() {
    try {
        localStorage.setItem('dumax_notes', JSON.stringify(NOTES_DATA));
    } catch (e) {
        console.error('Error saving notes:', e);
    }
}

function renderNotes(notes = NOTES_DATA) {
    const grid = document.getElementById('notesGrid');

    if (notes.length === 0) {
        grid.innerHTML = `
            <div style="text-align:center;padding:40px 20px;color:var(--text-secondary);grid-column:1/-1;">
                <i class="fas fa-sticky-note" style="font-size:48px;margin-bottom:16px;display:block;"></i>
                <p>یادداشتی وجود ندارد</p>
                <button class="btn-primary" style="margin-top:12px;" onclick="document.getElementById('addNoteBtn').click()">
                    <i class="fas fa-plus"></i> ایجاد یادداشت
                </button>
            </div>
        `;
        return;
    }

    // Sort: pinned first, then by updated date
    const sorted = [...notes].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    grid.innerHTML = sorted.map(note => `
        <div class="note-card ${note.pinned ? 'pinned' : ''}"
             style="border-right: 4px solid ${note.color || '#6C63FF'};"
             data-id="${note.id}">
            ${note.pinned ? '<i class="fas fa-thumbtack pin-icon"></i>' : ''}
            <h4>${escapeHtml(note.title)}</h4>
            <p>${escapeHtml(note.content)}</p>
            <div class="note-meta">
                <span>${formatDate(note.updatedAt)}</span>
                <span style="display:flex;gap:8px;">
                    <i class="fas fa-edit" style="cursor:pointer;" onclick="event.stopPropagation();editNote('${note.id}')"></i>
                    <i class="fas fa-trash" style="cursor:pointer;color:var(--secondary);" onclick="event.stopPropagation();deleteNote('${note.id}')"></i>
                </span>
            </div>
        </div>
    `).join('');

    // Add click to edit
    grid.querySelectorAll('.note-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.dataset.id;
            editNote(id);
        });
    });
}

function filterNotes(query) {
    const activeFilter = document.querySelector('.note-filters .filter-btn.active');
    const filter = activeFilter ? activeFilter.dataset.filter : 'all';

    let filtered = NOTES_DATA;

    if (filter === 'pinned') {
        filtered = filtered.filter(n => n.pinned);
    }

    if (query) {
        const lower = query.toLowerCase();
        filtered = filtered.filter(n =>
            n.title.toLowerCase().includes(lower) ||
            n.content.toLowerCase().includes(lower)
        );
    }

    renderNotes(filtered);
}

function openNoteModal(note = null) {
    const modal = document.getElementById('noteModal');
    const title = document.getElementById('noteModalTitle');
    const noteTitle = document.getElementById('noteTitle');
    const noteContent = document.getElementById('noteContent');
    const noteColor = document.getElementById('noteColor');
    const notePinned = document.getElementById('notePinned');
    const deleteBtn = document.getElementById('deleteNoteBtn');

    if (note) {
        title.textContent = 'ویرایش یادداشت';
        noteTitle.value = note.title;
        noteContent.value = note.content;
        noteColor.value = note.color || '#ffffff';
        notePinned.checked = note.pinned || false;
        document.getElementById('noteId').value = note.id;
        deleteBtn.style.display = 'inline-flex';
        currentNoteId = note.id;
    } else {
        title.textContent = 'یادداشت جدید';
        noteTitle.value = '';
        noteContent.value = '';
        noteColor.value = '#ffffff';
        notePinned.checked = false;
        document.getElementById('noteId').value = '';
        deleteBtn.style.display = 'none';
        currentNoteId = null;
    }

    modal.classList.add('active');
    setTimeout(() => noteTitle.focus(), 100);
}

function editNote(id) {
    const note = NOTES_DATA.find(n => n.id === id);
    if (note) {
        openNoteModal(note);
    }
}

function saveNote() {
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    const color = document.getElementById('noteColor').value;
    const pinned = document.getElementById('notePinned').checked;
    const id = document.getElementById('noteId').value;

    if (!title || !content) {
        showToast('لطفاً عنوان و متن یادداشت را وارد کنید', 'error');
        return;
    }

    if (id) {
        // Edit existing note
        const index = NOTES_DATA.findIndex(n => n.id === id);
        if (index !== -1) {
            NOTES_DATA[index] = {
                ...NOTES_DATA[index],
                title,
                content,
                color,
                pinned,
                updatedAt: new Date().toISOString()
            };
            showToast('یادداشت ویرایش شد', 'success');
        }
    } else {
        // Create new note
        const newNote = {
            id: Date.now().toString(),
            title,
            content,
            color,
            pinned,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        NOTES_DATA.unshift(newNote);
        showToast('یادداشت جدید ایجاد شد', 'success');
    }

    saveNotes();
    renderNotes();
    document.getElementById('noteModal').classList.remove('active');
}

function deleteNote(id = null) {
    if (!id) {
        id = document.getElementById('noteId').value;
    }

    if (!id) return;

    if (confirm('آیا از حذف این یادداشت مطمئن هستید؟')) {
        NOTES_DATA = NOTES_DATA.filter(n => n.id !== id);
        saveNotes();
        renderNotes();
        document.getElementById('noteModal').classList.remove('active');
        showToast('یادداشت حذف شد', 'success');
    }
}

// Helper functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'چند لحظه پیش';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} دقیقه پیش`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} ساعت پیش`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} روز پیش`;

    return date.toLocaleDateString('fa-IR');
}

// Export for global use
window.NOTES_DATA = NOTES_DATA;
window.renderNotes = renderNotes;
window.editNote = editNote;
window.deleteNote = deleteNote;
window.openNoteModal = openNoteModal;
