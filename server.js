// Importeer de vereiste modules
const express = require('express');
const mysql = require('mysql');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, set, push, get, child } = require('firebase/database');
const path = require('path');

// Maak een nieuwe Express-app
const app = express();

// Stel Firebase in
const firebaseConfig = {
  apiKey: "AIzaSyDsFqB8Kj2QMVODsl3-xn3l58cAycBVHKk", // Vervang met je Firebase API sleutel
  authDomain: "gay-belgium.firebaseapp.com", // Vervang met je Firebase Auth Domein
  databaseURL: "https://gay-belgium-default-rtdb.europe-west1.firebasedatabase.app", // Vervang met je Firebase Database URL
  projectId: "gay-belgium", // Vervang met je Firebase Project ID
  storageBucket: "gay-belgium.firebasestorage.app", // Vervang met je Firebase Storage Bucket
  messagingSenderId: "187335362616", // Vervang met je Firebase Sender ID
  appId: "1:187335362616:web:1486d680983c4956eefecd" // Vervang met je Firebase App ID
};

// Initialiseer Firebase
const appFirebase = initializeApp(firebaseConfig);

// Verkrijg toegang tot de Realtime Database
const database = getDatabase(appFirebase);

// Stel express in om statische bestanden te serveren
app.use(express.static(path.join(__dirname, 'public')));

// Stel Express in om JSON-gegevens te verwerken
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route voor het verkrijgen van gebruikers uit Firebase
app.get('/api/users', (req, res) => {
  const usersRef = ref(database, 'users'); // De locatie in de Realtime Database
  get(usersRef).then((snapshot) => {
    if (snapshot.exists()) {
      res.json(snapshot.val()); // Verkrijg de gebruikersgegevens
    } else {
      res.status(404).json({ message: 'Geen gebruikers gevonden' });
    }
  }).catch((err) => {
    res.status(500).json({ error: 'Fout bij het ophalen van gebruikers: ' + err });
  });
});

// Route voor het toevoegen van een nieuwe gebruiker aan Firebase
app.post('/api/users', (req, res) => {
  const { nickname, description, location, photos } = req.body; // Verkrijg de gegevens van de gebruiker
  const usersRef = ref(database, 'users'); // De locatie in de Realtime Database

  // Voeg de nieuwe gebruiker toe
  push(usersRef, {
    nickname,
    description,
    location,
    photos
  }).then(() => {
    res.status(201).json({ message: 'Gebruiker succesvol toegevoegd!' });
  }).catch((err) => {
    res.status(500).json({ error: 'Fout bij toevoegen gebruiker: ' + err });
  });
});

// Start de server op poort 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server draait op poort ${PORT}`);
});