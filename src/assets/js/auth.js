import { initializeApp } from "firebase-admin";
import { getAuth } from "../../../node_modules/firebase/auth"
const config = {
    apiKey: "AIzaSyDc2Vsd1gESoqY_-GJHU2VqLkVSsvuLh_8",
    authDomain: "playmedia-c0f48.firebaseapp.com",
    databaseURL: "https://playmedia-c0f48-default-rtdb.firebaseio.com",
    projectId: "playmedia-c0f48",
    storageBucket: "playmedia-c0f48.appspot.com",
    messagingSenderId: "849684529878",
    appId: "1:849684529878:web:98f2f07fe63b1d874c3f77",
    measurementId: "G-EXJ4P365H0"
}

const app = initializeApp(config)
const auth = getAuth(app)

function deleteUser(uid) {
    auth.deleteUser(uid).then(() => {
        console.log(uid + " eliminado");
    })
}