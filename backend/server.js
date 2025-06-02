const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const PORT = 3000;

// MongoDB connection URI - replace with your actual connection string
const mongoUri = 'mongodb://localhost:27017';
const dbName = 'mydatabase';

async function startServer() {
  try {
    // Connect to MongoDB
    const client = new MongoClient(mongoUri);
    await client.connect();
    console.log('Connected successfully to MongoDB');

    // You can use the db object to perform database operations
    const db = client.db(dbName);

    // Serve static files from frontend/templates directory
    app.use(express.static(path.join(__dirname, '../frontend/templates')));

    // Redirect root route to index.html
    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../frontend/templates/index.html'));
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

startServer();
