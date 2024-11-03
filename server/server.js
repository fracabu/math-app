const express = require('express');
const app = express();
const PORT = 3000;

let progressData = {}; // Inizialmente, usiamo una variabile per i dati

app.use(express.json());

// Endpoint per salvare i progressi
app.post('/save-progress', (req, res) => {
    const { userId, progress } = req.body;
    progressData[userId] = progress; // Salva i progressi
    res.json({ message: 'Progressi salvati!' });
});

// Endpoint per recuperare i progressi
app.get('/get-progress/:userId', (req, res) => {
    const userId = req.params.userId;
    const progress = progressData[userId] || {};
    res.json(progress);
});

app.listen(PORT, () => console.log(`Server in ascolto su http://localhost:${PORT}`));
