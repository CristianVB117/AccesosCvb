import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-storage.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC6QvtPoSkGPX2vmnv8GxTzD1yTOixqePU",
  authDomain: "accesos-ut.firebaseapp.com",
  projectId: "accesos-ut",
  storageBucket: "accesos-ut.appspot.com",
  messagingSenderId: "62584472022",
  appId: "1:62584472022:web:a5e48c0fb003511445e477",
  measurementId: "G-193NNYC6PG"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Función para autenticar anónimamente
const authenticateAnonymously = () => {
  signInAnonymously(auth)
    .then(() => {
      console.log('Usuario anónimo autenticado');
    })
    .catch((error) => {
      console.error('Error al autenticar al usuario anónimo:', error);
    });
};

// Llamar a la función para autenticar anónimamente al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  authenticateAnonymously();
});

// Función para guardar una tarea en Firestore
export const saveTask = async (taskData) => {
  const { nombre, motivo, fecha, correo, telefono, imagenFile } = taskData;

  // Subir la imagen al almacenamiento de Firebase
  const storageRef = ref(storage, `imagenes/${imagenFile.name}`);
  const snapshot = await uploadBytes(storageRef, imagenFile);
  const imagenURL = await getDownloadURL(snapshot.ref);

  // Guardar los datos en Firestore y obtener la referencia al documento creado
  const docRef = await addDoc(collection(db, "Visitantes"), {
    nombre,
    motivo,
    fecha,
    correo,
    telefono,
    imagen: imagenURL // Guardar la URL de la imagen en lugar del objeto File
  });

  // Generar y mostrar el código QR
  generateQRCode(docRef.id);
};

// Función para actualizar una tarea en Firestore
export const updateTask = (id, newFields) => updateDoc(doc(db, "Visitantes", id), newFields);

// Función para eliminar una tarea de Firestore
export const deleteTask = (id) => deleteDoc(doc(db, "Visitantes", id));

// Función para obtener una tarea específica de Firestore
export const getTask = (id) => getDoc(doc(db, "Visitantes", id));

// Función para obtener actualizaciones en tiempo real de las tareas desde Firestore
export const onGetTasks = (callback) => onSnapshot(collection(db, "Visitantes"), callback);

// Función para generar un código QR
const generateQRCode = (text, containerId) => {
  const qrCodeContainer = document.getElementById(containerId);
  if (!qrCodeContainer) return;

  qrCodeContainer.innerHTML = ""; // Limpiar cualquier QR anterior
  new QRCode(qrCodeContainer, {
    text: text,
    width: 128,
    height: 128
  });
};

// Configuración de Flatpickr para el input de fecha
document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("task-fecha");

  flatpickr(dateInput, {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    minDate: "today",
    maxDate: "2024-12-31",
    defaultDate: "today",
  });
});

// Variables globales para el formulario
let editStatus = false;
let id = "";

// Event listener para el formulario
document.addEventListener("DOMContentLoaded", async () => {
  const taskForm = document.getElementById("task-form");
  const tasksContainer = document.getElementById("tasks-container");
  const errorMessage = document.getElementById("error-message");
  const errorMessages = document.getElementById("error-messages");
  const motivoSelect = document.getElementById("task-motivo");
  const motivoOtroContainer = document.getElementById("task-motivo-otro-container");
  const generateQRCodeBtn = document.getElementById("btn-task-form");

  // Verificar que todos los elementos necesarios estén presentes en el DOM
  if (!taskForm || !tasksContainer || !errorMessage || !errorMessages || !motivoSelect || !motivoOtroContainer || !generateQRCodeBtn) {
    console.error("Uno o más elementos no fueron encontrados en el DOM.");
    return;
  }

  // Obtener y mostrar las tareas existentes al cargar la página
  onGetTasks((querySnapshot) => {
    tasksContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const task = doc.data();

      tasksContainer.innerHTML += `
        <div class="card card-body mt-2 border-primary">
          <h3 class="h5">${task.nombre}</h3>
          <p>${task.motivo}</p>
          <p>${task.fecha}</p>
          <p>${task.correo}</p>
          <p>${task.telefono}</p>
          ${task.imagen ? `<img src="${task.imagen}" alt="${task.nombre}" style="max-width: 100%;">` : ""}
          <div id="qr-code-${doc.id}" class="qr-code-container"></div>
          <div>
            <button class="btn btn-primary btn-delete" data-id="${doc.id}">Eliminar</button>
            <button class="btn btn-secondary btn-edit" data-id="${doc.id}">Editar</button>
          </div>
        </div>`;

      generateQRCode(doc.id, `qr-code-${doc.id}`);
    });

    // Asignar eventos a los botones de eliminar y editar
    const btnsDelete = tasksContainer.querySelectorAll(".btn-delete");
    btnsDelete.forEach((btn) => {
      btn.addEventListener("click", async ({ target: { dataset } }) => {
        const confirmation = confirm("¿Está seguro de eliminar este registro?");
        if (confirmation) {
          try {
            await deleteTask(dataset.id);
          } catch (error) {
            console.log(error);
          }
        }
      });
    });

    const btnsEdit = tasksContainer.querySelectorAll(".btn-edit");
    btnsEdit.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        try {
          const doc = await getTask(e.target.dataset.id);
          const task = doc.data();

          // Llenar el formulario con los datos de la tarea seleccionada para editar
          taskForm["task-nombre"].value = task.nombre;
          taskForm["task-motivo"].value = task.motivo;
          taskForm["task-fecha"].value = task.fecha;
          taskForm["task-correo"].value = task.correo;
          taskForm["task-telefono"].value = task.telefono;

          editStatus = true;
          id = doc.id;
          generateQRCodeBtn.innerText = "Actualizar";
        } catch (error) {
          console.log(error);
        }
      });
    });
  });

  // Validación de fecha y hora seleccionadas
  const dateInput = document.getElementById("task-fecha");
  dateInput.addEventListener("input", function () {
    const selectedDate = new Date(dateInput.value);

    if (selectedDate.getDay() === 6 || selectedDate.getDay() === 0) {
      errorMessage.style.display = "block";
      errorMessages.style.display = "none";
      dateInput.value = "";
    } else {
      errorMessage.style.display = "none";
      const selectedHour = selectedDate.getHours();
      if (selectedHour < 8 || selectedHour >= 17) {
        errorMessages.style.display = "block";
        dateInput.value = "";
      } else {
        errorMessages.style.display = "none";
      }
    }
  });

  // Mostrar u ocultar campo de motivo específico
  motivoSelect.addEventListener("change", function () {
    if (motivoSelect.value === "otro") {
      motivoOtroContainer.classList.remove("hidden");
    } else {
      motivoOtroContainer.classList.add("hidden");
    }
  });

  // Generar código QR al hacer clic en el botón "Guardar y Generar QR"
  generateQRCodeBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      const nombre = taskForm["task-nombre"].value;
      const motivo = taskForm["task-motivo"].value;
      const fecha = taskForm["task-fecha"].value;
      const correo = taskForm["task-correo"].value;
      const telefono = taskForm["task-telefono"].value;
      const imagenFile = taskForm["task-imagen"].files[0];

      if (editStatus) {
        await updateTask(id, {
          nombre,
          motivo,
          fecha,
          correo,
          telefono,
        });

        editStatus = false;
        id = "";
        generateQRCodeBtn.innerText = "Guardar y Generar QR";
      } else {
        await saveTask({
          nombre,
          motivo,
          fecha,
          correo,
          telefono,
          imagenFile,
        });
      }

      taskForm.reset();
    } catch (error) {
      console.log(error);
    }
  });
});
