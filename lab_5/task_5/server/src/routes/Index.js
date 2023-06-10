import mongodb from 'mongodb';
import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// user view
const indexRouter = express.Router();
indexRouter.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// buy vehicle
indexRouter.post('/login', (req, res) => {
  // Logika obsługi dodawania nowych pojazdów
  res.send('Logowanie');
});

// rent vehicle
indexRouter.post('/register', (req, res) => {
  // Logika obsługi dodawania nowych pojazdów
  res.send('Rejestracja');
});


module.exports = indexRouter;

