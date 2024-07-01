import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-app.js";
import { getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, getDoc, updateDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.2/firebase-firestore.js";
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
const auth = getAuth();

// Iniciar sesión como usuario anónimo
signInAnonymously(auth)
  .then(() => {
    console.log('Usuario anónimo autenticado');
  })
  .catch((error) => {
    console.error('Error al autenticar al usuario anónimo:', error);
  });

/**
 * Guardar una nueva tarea en Firestore
 * @param {Object} taskData Datos de la tarea a guardar
 * @returns {Promise<void>}
 */
export const saveTask = async (taskData) => {
  const { nombre, motivo, fecha, correo, telefono, imagenFile } = taskData;

  try {
    // Subir la imagen al almacenamiento de Firebase
    const storageRef = ref(storage, `imagenes/${imagenFile.name}`);
    const snapshot = await uploadBytes(storageRef, imagenFile);
    const imagenURL = await getDownloadURL(snapshot.ref);

    // Guardar los datos en Firestore
    const docRef = await addDoc(collection(db, "Visitantes"), {
      nombre,
      motivo,
      fecha,
      correo,
      telefono,
      imagen: imagenURL // Guardar la URL de la imagen en lugar del objeto File
    });

    console.log('Tarea guardada con ID:', docRef.id);
  } catch (error) {
    console.error('Error al guardar la tarea:', error);
    throw error;
  }
};

/**
 * Obtener actualizaciones en tiempo real de las tareas desde Firestore
 * @param {function} callback Función que se llama con el snapshot
 * @returns {function} Función para detener la escucha de actualizaciones
 */
export const onGetTasks = (callback) => {
  return onSnapshot(collection(db, "Visitantes"), callback);
};

/**
 * Eliminar una tarea de Firestore
 * @param {string} id ID de la tarea a eliminar
 * @returns {Promise<void>}
 */
export const deleteTask = async (id) => {
  try {
    await deleteDoc(doc(db, "Visitantes", id));
  } catch (error) {
    console.error("Error al eliminar la tarea:", error);
    throw error;
  }
};

/**
 * Obtener una tarea específica desde Firestore
 * @param {string} id ID de la tarea a obtener
 * @returns {Promise<DocumentSnapshot>} Snapshot del documento
 */
export const getTask = async (id) => {
  try {
    const docSnap = await getDoc(doc(db, "Visitantes", id));
    return docSnap;
  } catch (error) {
    console.error("Error al obtener la tarea:", error);
    throw error;
  }
};

/**
 * Actualizar una tarea en Firestore
 * @param {string} id ID de la tarea a actualizar
 * @param {object} newFields Nuevos campos a actualizar
 * @returns {Promise<void>}
 */
export const updateTask = async (id, newFields) => {
  try {
    await updateDoc(doc(db, "Visitantes", id), newFields);
  } catch (error) {
    console.error("Error al actualizar la tarea:", error);
    throw error;
  }
};

/**
 * Obtener todas las tareas desde Firestore
 * @returns {Promise<QuerySnapshot>} Snapshot de la colección de tareas
 */
export const getTasks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Visitantes"));
    return querySnapshot;
  } catch (error) {
    console.error("Error al obtener las tareas:", error);
    throw error;
  }
};
