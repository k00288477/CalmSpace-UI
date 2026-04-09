import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyAFpRQKT2LJp2jgvwJfnfR8p-bUFLll2pA",
    authDomain: "calmspace-e334d.firebaseapp.com",
    databaseURL: "https://calmspace-e334d-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "calmspace-e334d",
    storageBucket: "calmspace-e334d.firebasestorage.app",
    messagingSenderId: "594074342213",
    appId: "1:594074342213:web:a2cfc4d7e024eeae70642c"
};

const firebaseApp = initializeApp(firebaseConfig)
export const db = getDatabase(firebaseApp)