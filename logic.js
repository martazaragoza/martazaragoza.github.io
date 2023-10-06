const loadNotes = () => {
    // Load existing notes JSON if any
    let notesString = localStorage.getItem("notes");
    let notes = JSON.parse(notesString);
    return notes ?? {};
};

const mapCategoryToClass = (category) => {
    switch (category) {
        case "personal":
            return "green";
        case "work":
            return "pink";
        case "leisure":
            return "blue";
        default:
            return "green";
    }
}

const renderNotes = () => {
    // Show existing notes
    let notes = loadNotes();
    let notesContainer = document.getElementById("notes-container");
    notesContainer.innerHTML = null;
    Object.keys(notes).forEach((noteId) => {
        // Get the note object by its uuid
        let note = notes[noteId];
        // Unpack JSON values for title, content and category
        let {title, content, category} = note;
        console.log(notesContainer)
        notesContainer.innerHTML += `
        <div class="note ${mapCategoryToClass(category)}">
            <div>
                <h3>${title}</h3>
                <p class="note-content">${content}</p>
            </div>
            <div class="footer"> 
                <span class="category-label">${category}</span>
                <div>
                    <button onclick="openNoteEditor('${noteId}')">Editar</button>
                    <button onclick="deleteNote('${noteId}')">Borrar</button>
                </div>
            </div>              
        </div>
        `
    });
}

const clearForm = () => {
    // Clear title input field
    document.getElementById("title").value = "";
    // Clear content textarea
    document.getElementById("content").value = "";
}

const createNote = (e) => {
    console.log("Create note was clicked!");
    // Get the title, content and category from the input fields
    let title = document.getElementById('title').value;
    let content = document.getElementById('content').value;
    let category = document.getElementById('category').value;
    if (!title || !content || !category) {
        alert("Por favor rellene los campos.");
        return;
    }
    // Create note
    let note = {title, content, category};
    // Get existing notes
    let existingNotes = loadNotes();
    // Generate uuid for the new note
    let noteId = crypto.randomUUID();
    // Update notes with new one
    existingNotes[noteId] = note
    console.log(existingNotes)
    // Save the new note into localStorage (needs to be converted from JSON to string)
    let notesString = JSON.stringify(existingNotes);
    localStorage.setItem("notes", notesString);
    // Update and show notes
    renderNotes();
    // Clear form
    clearForm();
};

const deleteNote = (noteId) => {
    // Get existing notes
    let existingNotes = loadNotes();
    // Delete note with noteId
    delete existingNotes[noteId];
    // Save modified notes
    localStorage.setItem("notes", JSON.stringify(existingNotes));
    // Update and show notes
    renderNotes();
};

const openNoteEditor = (noteId) => {
    let notes = loadNotes();
    let note = notes[noteId];
    let modal = document.getElementById("note-editor");
    modal.style.display = "block";
    modal.innerHTML = `
    <form class="edit-note-form ${mapCategoryToClass(note.category)}">
        <label for="title" class="edit-label">Título:</label>
        <input type="text" id="title-edit" value="${note.title}" required>
        <label for="content" class="edit-label">Contenido:</label>
        <textarea id="content-edit" rows="4" required>${note.content}</textarea>
        <label for="category" class="edit-label">Categoría:</label>
        <select id="category-edit" selected="${note.category}">
            <!-- Opciones de categoría aquí -->
            <option ${note.category === "personal" ? "selected" : null} value="personal">Personal</option>
            <option ${note.category === "work" ? "selected" : null} value="work">Trabajo</option>
            <option ${note.category === "leisure" ? "selected" : null} value="leisure">Ocio</option>
        </select>
        <div class="edit-buttons">
            <button class="edit-button" onclick="closeNoteEditor()">Cerrar</button>
            <button class="edit-button" onclick="editNote('${noteId}')">Guardar</button>
        </div>
    </form>
    `
}

const closeNoteEditor = () => {
    let modal = document.getElementById("note-editor");
    modal.style.display = "none";
}



const editNote = (noteId) => {
    let existingNotes = loadNotes();
    let newTitle = document.getElementById("title-edit").value;
    let newContent = document.getElementById("content-edit").value;
    let newCategory = document.getElementById("category-edit").value;
    // Create note
    let updatedNote = {title: newTitle, content: newContent, category: newCategory};
    existingNotes[noteId] = updatedNote;
    // Save the updated note into localStorage (needs to be converted from JSON to string)
    let notesString = JSON.stringify(existingNotes);
    localStorage.setItem("notes", notesString);
    // Close the note editor
    closeNoteEditor();
    // Update and show notes
    renderNotes();
};


// 3DJS GRAPHS