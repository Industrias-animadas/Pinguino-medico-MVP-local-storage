// Espera a que todo el contenido del DOM esté completamente cargado.
document.addEventListener('DOMContentLoaded', () => {

    // --- SELECCIÓN DE ELEMENTOS DEL DOM ---
    const patientForm = document.getElementById('patient-form');
    const clinicalNoteOutput = document.getElementById('clinical-note-output');
    const copyBtn = document.getElementById('copy-btn');
    const notesHistoryList = document.getElementById('notes-history-list'); // Nuevo elemento: la lista del historial

    // --- CONSTANTES ---
    const STORAGE_KEY = 'clinicalNotesHistory'; // Clave para guardar y leer de localStorage

    // --- FUNCIONES AUXILIARES PARA LOCALSTORAGE ---

    /**
     * Carga las notas desde localStorage.
     * @returns {Array} Un array de objetos de notas, o un array vacío si no hay nada.
     */
    const loadNotesFromStorage = () => {
        const notesJSON = localStorage.getItem(STORAGE_KEY);
        // Si hay datos, los convierte de string JSON a un array de JS. Si no, devuelve un array vacío.
        return notesJSON ? JSON.parse(notesJSON) : [];
    };

    /**
     * Guarda un array de notas en localStorage.
     * @param {Array} notesArray El array de notas a guardar.
     */
    const saveNotesToStorage = (notesArray) => {
        // localStorage solo puede guardar strings. Convertimos el array a un string en formato JSON.
        const notesJSON = JSON.stringify(notesArray);
        localStorage.setItem(STORAGE_KEY, notesJSON);
    };


    // --- FUNCIONES DE RENDERIZADO Y LÓGICA ---

    /**
     * Genera el texto formateado de la nota clínica.
     * @param {object} patientData - Un objeto con la información del paciente.
     * @returns {string} - La cadena de texto con la nota clínica formateada.
     */
    const generateClinicalNoteText = (patientData) => {
        return `
Paciente: ${patientData.name}
ID: ${patientData.id}
Edad: ${patientData.age} años

Motivo de Consulta:
Paciente consulta por cuadro clínico de ${patientData.duration} de evolución consistente en ${patientData.mainSymptom}.

Análisis:
[Pendiente de análisis y examen físico]

Plan:
[Pendiente de definir plan de manejo]
        `.trim();
    };

    /**
     * Renderiza la lista del historial en el HTML.
     */
    const renderHistory = () => {
        const notes = loadNotesFromStorage();
        notesHistoryList.innerHTML = ''; // Limpia la lista actual para evitar duplicados

        if (notes.length === 0) {
            notesHistoryList.innerHTML = '<li><span>No hay notas guardadas.</span></li>';
            return;
        }

        notes.forEach((note, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${note.name} - ${note.mainSymptom}</span>
                <button class="load-note-btn" data-index="${index}">Cargar</button>
            `;
            notesHistoryList.appendChild(listItem);
        });
    };


    // --- ASIGNACIÓN DE EVENT LISTENERS ---

    // 1. Event Listener para el formulario (Generar Nota)
    patientForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Crea el objeto con los datos del paciente desde el formulario.
        const patientData = {
            name: document.getElementById('patient-name').value,
            id: document.getElementById('patient-id').value,
            age: document.getElementById('patient-age').value,
            mainSymptom: document.getElementById('main-symptom').value,
            duration: document.getElementById('symptom-duration').value
        };

        // Genera el texto y lo muestra en el textarea.
        const generatedNoteText = generateClinicalNoteText(patientData);
        clinicalNoteOutput.value = generatedNoteText;

        // --- LÓGICA DE GUARDADO ---
        const notes = loadNotesFromStorage(); // Carga el historial existente
        notes.push(patientData); // Añade la nueva nota al array
        saveNotesToStorage(notes); // Guarda el array actualizado en localStorage
        renderHistory(); // Vuelve a renderizar la lista del historial en la página

        patientForm.reset(); // Opcional: Limpia el formulario después de generar la nota
    });

    // 2. Event Listener para el botón de Copiar
    copyBtn.addEventListener('click', () => {
        const textToCopy = clinicalNoteOutput.value;
        if (!textToCopy) {
            alert('No hay nada que copiar.');
            return;
        }
        navigator.clipboard.writeText(textToCopy)
            .then(() => alert('¡Nota clínica copiada!'))
            .catch(err => console.error('Error al copiar: ', err));
    });

    // 3. Event Listener para la lista del historial (usando delegación de eventos)
    notesHistoryList.addEventListener('click', (event) => {
        // Comprueba si el elemento clickeado es un botón de "Cargar"
        if (event.target.classList.contains('load-note-btn')) {
            const noteIndex = event.target.dataset.index; // Obtiene el índice de la nota desde el atributo data-index
            const notes = loadNotesFromStorage();
            const selectedNote = notes[noteIndex]; // Obtiene el objeto de la nota seleccionada

            // Rellena el formulario y el textarea con los datos de la nota cargada
            document.getElementById('patient-name').value = selectedNote.name;
            document.getElementById('patient-id').value = selectedNote.id;
            document.getElementById('patient-age').value = selectedNote.age;
            document.getElementById('main-symptom').value = selectedNote.mainSymptom;
            document.getElementById('symptom-duration').value = selectedNote.duration;
            clinicalNoteOutput.value = generateClinicalNoteText(selectedNote);
        }
    });


    // --- INICIALIZACIÓN ---
    // Renderiza el historial guardado tan pronto como la página se carga.
    renderHistory();
});
