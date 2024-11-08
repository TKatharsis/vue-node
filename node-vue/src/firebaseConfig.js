// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, update, remove, query, limitToLast, onValue } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDQ4xEcUgBvp7c-f7ecpxGHIVzrP8EOqOE",
    authDomain: "pawn-25e89.firebaseapp.com",
    databaseURL: "https://pawn-25e89-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pawn-25e89",
    storageBucket: "pawn-25e89.firebasestorage.app",
    messagingSenderId: "47241869116",
    appId: "1:47241869116:web:ed8cd93d57edb538c5d039",
    measurementId: "G-64SL6NY45R"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue, push, update, remove,query, limitToLast };