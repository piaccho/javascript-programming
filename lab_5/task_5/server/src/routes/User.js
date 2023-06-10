import mongodb from 'mongodb';
import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// user view
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index'); 
  // Render the 'index' view 
  // Wygenerowanie HTML na podstawie danych produktów
  // const html = generateProductPage();

  // Zwrócenie wygenerowanego HTML jako odpowiedź
  // res.send(html);
  // res.sendFile(__dirname + '/public/index/index.html');
});

// buy vehicle
router.post('/buy', (req, res) => {
  // Logika obsługi dodawania nowych pojazdów
  res.send('Kupowanie pojazdu');
});

// rent vehicle
router.post('/rent', (req, res) => {
  // Logika obsługi dodawania nowych pojazdów
  res.send('Wypożyczanie pojazdu');
});

// return vehicle
router.post('/return', (req, res) => {

});

export default router

