// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyDQ4xEcUgBvp7c-f7ecpxGHIVzrP8EOqOE",
    authDomain: "pawn-25e89.firebaseapp.com",
    databaseURL: "https://pawn-25e89-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pawn-25e89",
    messagingSenderId: "47241869116",
    
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const messaging = getMessaging(app);

export { messaging };
export { database };