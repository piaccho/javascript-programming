import mongodb from 'mongodb';
import express from 'express'


const router = express.Router();

// admin view
router.get('/', (req, res) => {
  // Pozostałe funkcjonalności dla panelu obsługi
  res.send('Inne funkcjonalności dla panelu obsługi');
});

// add vehicle
router.post('/add', (req, res) => {
  // Logika obsługi dodawania nowych pojazdów
  res.send('Dodawanie nowych pojazdów');
});

export default router

