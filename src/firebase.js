import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDavDa8ID815PUO04Tp7BFMnDqKURtMx3g",
  authDomain: "tristancraft.firebaseapp.com",
  databaseURL: "https://tristancraft-default-rtdb.firebaseio.com",
  projectId: "tristancraft",
  storageBucket: "tristancraft.firebasestorage.app",
  messagingSenderId: "59923790311",
  appId: "1:59923790311:web:5c1213835d92ff0a8de542",
  measurementId: "G-7Q209F5C8Q"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
