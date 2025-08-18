// Espera a que todo el contenido del DOM esté completamente cargado antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {

    // --- SELECCIÓN DE ELEMENTOS DEL DOM ---
    // Obtiene referencias a los elementos HTML con los que vamos a interactuar.
    const patientForm = document.getElementById('patient-form');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clinicalNoteOutput = document.getElementById('clinical-note-output');

    // --- DEFINICIÓN DE FUNCIONES ---

    /**
     * Genera una nota clínica formateada a partir de los datos de un paciente.
     * @param {object} patientData - Un objeto con la información del paciente.
     * @returns {string} - La cadena de texto con la nota clínica formateada.
     */
    const generateClinicalNote = (patientData) => {
        // Usamos template literals (comillas invertidas ``) para construir la cadena fácilmente.
        // Esto crea una estructura básica para la nota de la historia clínica.
        const note = `
Paciente: ${patientData.name}
ID: ${patientData.id}
Edad: ${patientData.age} años

Motivo de Consulta:
Paciente consulta por cuadro clínico de ${patientData.duration} de evolución consistente en ${patientData.mainSymptom}.

Análisis:
[Pendiente de análisis y examen físico]

Plan:
[Pendiente de definir plan de manejo]
        `.trim(); // .trim() elimina espacios en blanco al inicio y al final.

        return note;
    };


    // --- ASIGNACIÓN DE EVENT LISTENERS ---

    // 1. Event Listener para el botón "Generar Nota"
    patientForm.addEventListener('submit', (event) => {
        // previene el comportamiento por defecto del formulario (que es recargar la página).
        event.preventDefault();

        // Crea un objeto para almacenar los datos del paciente leídos desde el formulario.
        const patientData = {
            name: document.getElementById('patient-name').value,
            id: document.getElementById('patient-id').value,
            age: document.getElementById('patient-age').value,
            mainSymptom: document.getElementById('main-symptom').value,
            duration: document.getElementById('symptom-duration').value
        };

        // Llama a la función para generar la nota con los datos recolectados.
        const generatedNote = generateClinicalNote(patientData);

        // Muestra la nota generada en el textarea de resultados.
        clinicalNoteOutput.value = generatedNote;
    });

    // 2. Event Listener para el botón "Copiar al Portapapeles"
    copyBtn.addEventListener('click', () => {
        const textToCopy = clinicalNoteOutput.value;

        // Si no hay texto en el textarea, no hace nada.
        if (!textToCopy) {
            alert('No hay nada que copiar. Por favor, genera una nota primero.');
            return;
        }

        // Usa la API del Navegador 'Clipboard' para copiar el texto.
        // Esta es la forma moderna y segura de hacerlo.
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Éxito: El texto se copió correctamente.
            // Proporciona feedback al usuario.
            alert('¡Nota clínica copiada al portapapeles!');
        }).catch(err => {
            // Error: Hubo un problema al copiar.
            console.error('Error al intentar copiar el texto: ', err);
            alert('Hubo un error al copiar el texto. Revise la consola del navegador.');
        });
    });

});
