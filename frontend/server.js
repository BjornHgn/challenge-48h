require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI);


console.log('Registering static files middleware');
app.use(express.static(path.join(__dirname, '../frontend')));

console.log('Registering health check route');
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

console.log('Registering fallback route');
app.get('/*', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../frontend/templates') });
});
// Middleware
app.use(express.json());
app.use(cors());
// app.use(cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true
// }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes (placeholder)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Fallback pour les routes inconnues (utile si tu fais une SPA)
app.get('/*', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '../frontend/templates') });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});