// app.js
document.addEventListener('DOMContentLoaded', () => {
    const progressDisplay = document.getElementById('progress');

    // Funzione per caricare i progressi
    function loadProgress() {
        fetch('http://localhost:3000/get-progress/user1')
            .then(response => response.json())
            .then(data => {
                progressDisplay.textContent = `Progressi: ${data.progress || 0}`;
            })
            .catch(error => console.error("Errore nel caricamento dei progressi:", error));
    }

    // Funzione per salvare i progressi
    function saveProgress(newProgress) {
        fetch('http://localhost:3000/save-progress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: 'user1', progress: newProgress })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            loadProgress(); // Aggiorna la visualizzazione dei progressi
        })
        .catch(error => console.error("Errore nel salvataggio dei progressi:", error));
    }

    loadProgress(); // Carica i progressi quando la pagina è caricata
});
