// Aggiungi all'inizio del file, subito dopo le configurazioni
const API_URL = 'http://localhost:3000';

// Modifica l'oggetto gameState esistente
let gameState = {
    currentLevel: 'facile',
    operation: null,
    currentProblemIndex: 0,
    correctAnswers: 0,
    maxProblems: 5,
    carries: [], 
    borrows: [], 
    intermediateSteps: [],
    showingHints: false,
    userId: 'user1' // Aggiunto per l'identificazione utente
};

// Aggiungi queste nuove funzioni per la gestione del server
async function saveProgress() {
    try {
        const response = await fetch(`${API_URL}/save-progress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: gameState.userId,
                progress: {
                    operation: gameState.operation,
                    level: gameState.currentLevel,
                    correctAnswers: gameState.correctAnswers,
                    totalProblems: gameState.maxProblems
                }
            })
        });
        const data = await response.json();
        console.log('Progressi salvati:', data.message);
    } catch (error) {
        console.error('Errore nel salvataggio dei progressi:', error);
    }
}

async function loadProgress() {
    try {
        const response = await fetch(`${API_URL}/get-progress/${gameState.userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore nel caricamento dei progressi:', error);
        return {};
    }
}

// Modifica la funzione handleLevelCompletion esistente con questa versione
function handleLevelCompletion() {
    const container = document.querySelector('.exercise-container');
    const requiredCorrect = Math.ceil(gameState.maxProblems * 0.8);
    
    saveProgress(); // Salva i progressi sul server

    if (gameState.correctAnswers >= requiredCorrect) {
        showSuccessScreen();
    } else {
        showRetryScreen();
    }
}

// Aggiungi queste nuove funzioni per la gestione dei livelli
function showSuccessScreen() {
    const nextLevel = getNextLevel();
    const container = document.querySelector('.exercise-container');
    
    container.innerHTML = `
        <div class="level-complete">
            <h2>🎉 Livello Completato! 🎉</h2>
            <p>Hai risposto correttamente a ${gameState.correctAnswers} su ${gameState.maxProblems} problemi!</p>
            ${nextLevel ? `
                <button class="next-level-button" onclick="startNextLevel('${nextLevel}')">
                    Vai al livello ${nextLevel} →
                </button>
            ` : `
                <div class="operation-complete">
                    <h3>🏆 Hai completato tutti i livelli di ${gameState.operation}!</h3>
                    <button class="choose-operation-button" onclick="goToOperationSelection()">
                        Scegli un'altra operazione
                    </button>
                </div>
            `}
        </div>
    `;
}

function showRetryScreen() {
    const container = document.querySelector('.exercise-container');
    container.innerHTML = `
        <div class="level-failed">
            <h2>😕 Riprova!</h2>
            <p>Hai risposto correttamente a ${gameState.correctAnswers} su ${gameState.maxProblems} problemi.</p>
            <p>Devi ottenere almeno ${Math.ceil(gameState.maxProblems * 0.8)} risposte corrette per passare al livello successivo.</p>
            <button class="retry-button" onclick="retryLevel()">
                Riprova questo livello
            </button>
        </div>
    `;
}

function startNextLevel(nextLevel) {
    gameState.currentLevel = nextLevel;
    gameState.currentProblemIndex = 0;
    gameState.correctAnswers = 0;
    
    const levelSelection = document.getElementById('levelSelection');
    if (levelSelection) {
        levelSelection.style.display = 'none';
    }
    
    createOrShowExerciseContainer();
    showNextProblem();
}

function retryLevel() {
    gameState.currentProblemIndex = 0;
    gameState.correctAnswers = 0;
    createOrShowExerciseContainer();
    showNextProblem();
}

function goToOperationSelection() {
    window.location.href = 'exercises.html';
}

function getNextLevel() {
    const levels = ['facile', 'intermedio', 'difficile'];
    const currentIndex = levels.indexOf(gameState.currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
}

// Modifica la funzione startExercise esistente
async function startExercise(level, operation) {
    const progress = await loadProgress();
    
    gameState = {
        currentLevel: level,
        operation: operation,
        currentProblemIndex: 0,
        correctAnswers: 0,
        maxProblems: 5,
        carries: [],
        borrows: [],
        intermediateSteps: [],
        showingHints: false,
        userId: 'user1'
    };
    
    const levelSelection = document.getElementById('levelSelection');
    if (levelSelection) {
        levelSelection.style.display = 'none';
    }
    
    createOrShowExerciseContainer();
    showNextProblem();
}

// Configurazione del gioco
const gameConfig = {
    addizione: {
        facile: {
            operazioni: [
                { num1: 23, num2: 45 },
                { num1: 34, num2: 15 },
                { num1: 12, num2: 27 },
                { num1: 41, num2: 18 },
                { num1: 32, num2: 16 }
            ],
            maxDigits: 2,
            riporto: false
        },
        intermedio: {
            operazioni: [
                { num1: 234, num2: 456 },
                { num1: 345, num2: 567 },
                { num1: 789, num2: 123 },
                { num1: 432, num2: 345 },
                { num1: 654, num2: 234 }
            ],
            maxDigits: 3,
            riporto: true
        },
        difficile: {
            operazioni: [
                { num1: 2345, num2: 4567 },
                { num1: 3456, num2: 5678 },
                { num1: 7890, num2: 1234 },
                { num1: 4321, num2: 3456 },
                { num1: 6543, num2: 2345 }
            ],
            maxDigits: 4,
            riporto: true
        }
    },
    sottrazione: {
        facile: {
            operazioni: [
                { num1: 45, num2: 23 },
                { num1: 67, num2: 34 },
                { num1: 89, num2: 45 },
                { num1: 56, num2: 23 },
                { num1: 78, num2: 45 }
            ],
            maxDigits: 2,
            prestito: false
        },
        intermedio: {
            operazioni: [
                { num1: 567, num2: 234 },
                { num1: 789, num2: 456 },
                { num1: 654, num2: 321 },
                { num1: 876, num2: 543 },
                { num1: 765, num2: 432 }
            ],
            maxDigits: 3,
            prestito: true
        },
        difficile: {
            operazioni: [
                { num1: 6789, num2: 3456 },
                { num1: 8765, num2: 4321 },
                { num1: 9876, num2: 5432 },
                { num1: 7654, num2: 3211 },
                { num1: 8888, num2: 4444 }
            ],
            maxDigits: 4,
            prestito: true
        }
    },
    moltiplicazione: {
        facile: {
            operazioni: [
                { num1: 12, num2: 3 },
                { num1: 21, num2: 2 },
                { num1: 13, num2: 4 },
                { num1: 22, num2: 3 },
                { num1: 31, num2: 2 }
            ],
            maxDigits: { num1: 2, num2: 1 }
        },
        intermedio: {
            operazioni: [
                { num1: 23, num2: 12 },
                { num1: 32, num2: 11 },
                { num1: 24, num2: 13 },
                { num1: 42, num2: 21 },
                { num1: 33, num2: 12 }
            ],
            maxDigits: { num1: 2, num2: 2 }
        },
        difficile: {
            operazioni: [
                { num1: 123, num2: 12 },
                { num1: 234, num2: 11 },
                { num1: 321, num2: 13 },
                { num1: 213, num2: 21 },
                { num1: 132, num2: 12 }
            ],
            maxDigits: { num1: 3, num2: 2 }
        }
    },
    divisione: {
        facile: {
            operazioni: [
                { num1: 24, num2: 2 },
                { num1: 36, num2: 3 },
                { num1: 48, num2: 4 },
                { num1: 63, num2: 3 },
                { num1: 81, num2: 9 }
            ],
            maxDigits: { num1: 2, num2: 1 }
        },
        intermedio: {
            operazioni: [
                { num1: 246, num2: 2 },
                { num1: 369, num2: 3 },
                { num1: 484, num2: 4 },
                { num1: 636, num2: 6 },
                { num1: 812, num2: 4 }
            ],
            maxDigits: { num1: 3, num2: 1 }
        },
        difficile: {
            operazioni: [
                { num1: 2460, num2: 12 },
                { num1: 3696, num2: 14 },
                { num1: 4848, num2: 16 },
                { num1: 6364, num2: 13 },
                { num1: 8128, num2: 11 }
            ],
            maxDigits: { num1: 4, num2: 2 }
        }
    }
};



// Simboli e utilità
const operationSymbols = {
    addizione: '+',
    sottrazione: '-',
    moltiplicazione: '×',
    divisione: '÷'
};

// Funzioni principali
function startExercise(level, operation) {
    gameState = {
        currentLevel: level,
        operation: operation,
        currentProblemIndex: 0,
        correctAnswers: 0,
        maxProblems: 5,
        carries: [],
        borrows: [],
        intermediateSteps: [],
        showingHints: false
    };
    
    const levelSelection = document.getElementById('levelSelection');
    if (levelSelection) levelSelection.style.display = 'none';
    
    createOrShowExerciseContainer();
    showNextProblem();
}

function createOrShowExerciseContainer() {
    let container = document.querySelector('.exercise-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'exercise-container';
        container.innerHTML = `
            <div class="progress-bar">
                <div class="progress" style="width: 0%"></div>
                <span>Problema 1 di 5</span>
            </div>
            <div class="hint-button-container">
                <button class="hint-button" onclick="toggleHints()">
                    💡 Mostra suggerimenti
                </button>
            </div>
            <div class="column-operation">
                <div class="carries-row"></div>
                <div class="operation-grid"></div>
                <div class="intermediate-steps"></div>
                <div class="input-grid"></div>
            </div>
            <div class="controls">
                <button class="check-button" onclick="checkAnswer()">Verifica</button>
                <button class="skip-button" onclick="showNextProblem()">Salta</button>
            </div>
            <div class="feedback"></div>
        `;
        document.querySelector('.container').appendChild(container);
    }
    
    container.style.display = 'block';
}

function showNextProblem() {
    if (gameState.currentProblemIndex >= gameState.maxProblems) {
        handleLevelCompletion();
        return;
    }

    const problem = getCurrentProblem();
    resetProblemState();
    updateProgressBar();
    displayColumnOperation(problem);
    clearFeedback();
}

function getCurrentProblem() {
    return gameConfig[gameState.operation][gameState.currentLevel]
        .operazioni[gameState.currentProblemIndex];
}

function resetProblemState() {
    gameState.carries = [];
    gameState.borrows = [];
    gameState.intermediateSteps = [];
    gameState.showingHints = false;
}

function displayColumnOperation(problem) {
    const operationGrid = document.querySelector('.operation-grid');
    const inputGrid = document.querySelector('.input-grid');
    const carriesRow = document.querySelector('.carries-row');
    
    const config = gameConfig[gameState.operation][gameState.currentLevel];
    const maxDigits = getMaxDigits(config);
    
    // Formatta i numeri per l'allineamento
    const formattedNumbers = formatNumbersForDisplay(problem, maxDigits);
    
    // Genera HTML per l'operazione
    operationGrid.innerHTML = generateOperationHTML(formattedNumbers);
    
    // Setup input per la risposta
    const resultLength = getExpectedResultLength(problem);
    setupInputGrid(inputGrid, resultLength);
    
    // Inizializza riga dei riporti/prestiti
    carriesRow.innerHTML = generateCarriesHTML(maxDigits);
    
    // Setup eventi
    setupInputNavigation();
    setupHints(problem);
}

function formatNumbersForDisplay(problem, maxDigits) {
    const num1Str = problem.num1.toString().padStart(maxDigits, ' ');
    const num2Str = problem.num2.toString().padStart(maxDigits, ' ');
    return { num1Str, num2Str };
}

function generateOperationHTML({ num1Str, num2Str }) {
    const symbol = operationSymbols[gameState.operation];
    
    return `
        <div class="operation-row">
            ${num1Str.split('').map(digit => 
                `<div class="digit">${digit === ' ' ? '' : digit}</div>`
            ).join('')}
        </div>
        <div class="operation-row">
            <div class="operation-symbol">${symbol}</div>
            ${num2Str.split('').map(digit => 
                `<div class="digit">${digit === ' ' ? '' : digit}</div>`
            ).join('')}
        </div>
        <div class="operation-line"></div>
    `;
}

function setupInputGrid(inputGrid, length) {
    inputGrid.innerHTML = `
        <div class="input-row">
            ${Array(length).fill(0).map((_, i) => `
                <input type="text" 
                       maxlength="1" 
                       class="digit-input" 
                       data-position="${i}"
                       inputmode="numeric">
            `).join('')}
        </div>
    `;
}

function setupInputNavigation() {
    const inputs = document.querySelectorAll('.digit-input');
    
    inputs.forEach((input, index) => {
        input.addEventListener('keyup', (e) => {
            if (e.key >= '0' && e.key <= '9') {
                if (index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            } else if (e.key === 'Backspace') {
                if (index > 0 && input.value === '') {
                    inputs[index - 1].focus();
                }
            }
        });

        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    });
}

function toggleHints() {
    gameState.showingHints = !gameState.showingHints;
    const problem = getCurrentProblem();
    
    if (gameState.showingHints) {
        showHints(problem);
    } else {
        hideHints();
    }
}

function checkAnswer() {
    const problem = getCurrentProblem();
    const userAnswer = getUserAnswer();
    const correctAnswer = calculateCorrectAnswer(problem);
    
    const feedback = document.querySelector('.feedback');
    
    if (userAnswer === correctAnswer) {
        handleCorrectAnswer(feedback);
    } else {
        handleIncorrectAnswer(feedback, correctAnswer);
    }
}

function getUserAnswer() {
    const inputs = document.querySelectorAll('.digit-input');
    const userAnswer = Array.from(inputs)
        .map(input => input.value)
        .join('')
        .replace(/^0+/, '') || '0';
    
    return parseInt(userAnswer);
}

function handleCorrectAnswer(feedback) {
    gameState.correctAnswers++;
    feedback.textContent = '🎉 Corretto! Ottimo lavoro!';
    feedback.className = 'feedback correct';
    
    document.querySelector('.exercise-container').classList.add('celebrate');
    
    setTimeout(() => {
        document.querySelector('.exercise-container').classList.remove('celebrate');
        gameState.currentProblemIndex++;
        showNextProblem();
    }, 1500);
}

function handleIncorrectAnswer(feedback, correctAnswer) {
    feedback.textContent = '😕 Non proprio... Riprova!';
    feedback.className = 'feedback incorrect';
}

function handleLevelCompletion() {
    const container = document.querySelector('.exercise-container');
    const requiredCorrect = Math.ceil(gameState.maxProblems * 0.8);
    
    if (gameState.correctAnswers >= requiredCorrect) {
        showSuccessScreen();
    } else {
        showRetryScreen();
    }
}

function showSuccessScreen() {
    const nextLevel = getNextLevel();
    const container = document.querySelector('.exercise-container');
    
    container.innerHTML = `
        <div class="level-complete">
            <h2>🎉 Livello Completato! 🎉</h2>
            <p>Hai risposto correttamente a ${gameState.correctAnswers} su ${gameState.maxProblems} problemi!</p>
            ${nextLevel ? `
                <button class="check-button" onclick="startExercise('${nextLevel}', '${gameState.operation}')">
                    Vai al livello ${nextLevel}
                </button>
            ` : `
                <button class="check-button" onclick="window.location.href='exercises.html'">
                    Torna alla selezione degli esercizi
                </button>
            `}
        </div>
    `;
}

function getNextLevel() {
    const levels = ['facile', 'intermedio', 'difficile'];
    const currentIndex = levels.indexOf(gameState.currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
}

// Utility functions (continuazione)
function updateProgressBar() {
    const progress = (gameState.currentProblemIndex / gameState.maxProblems) * 100;
    const progressBar = document.querySelector('.progress');
    const progressText = document.querySelector('.progress-bar span');
    
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Problema ${gameState.currentProblemIndex + 1} di ${gameState.maxProblems}`;
}

function getMaxDigits(config) {
    if (typeof config.maxDigits === 'object') {
        return Math.max(config.maxDigits.num1, config.maxDigits.num2);
    }
    return config.maxDigits;
}

function getExpectedResultLength(problem) {
    switch(gameState.operation) {
        case 'addizione':
            return Math.max(
                problem.num1.toString().length,
                problem.num2.toString().length
            ) + 1;
        case 'sottrazione':
            return Math.max(
                problem.num1.toString().length,
                problem.num2.toString().length
            );
        case 'moltiplicazione':
            return problem.num1.toString().length + problem.num2.toString().length;
        case 'divisione':
            return Math.max(
                Math.floor(problem.num1 / problem.num2).toString().length,
                problem.num2.toString().length
            );
        default:
            return 5;
    }
}

function calculateCorrectAnswer(problem) {
    switch(gameState.operation) {
        case 'addizione':
            return problem.num1 + problem.num2;
        case 'sottrazione':
            return problem.num1 - problem.num2;
        case 'moltiplicazione':
            return problem.num1 * problem.num2;
        case 'divisione':
            return Math.floor(problem.num1 / problem.num2);
        default:
            return 0;
    }
}

// Funzioni per i suggerimenti e i passaggi intermedi
function showHints(problem) {
    switch(gameState.operation) {
        case 'addizione':
            showAdditionHints(problem);
            break;
        case 'sottrazione':
            showSubtractionHints(problem);
            break;
        case 'moltiplicazione':
            showMultiplicationHints(problem);
            break;
        case 'divisione':
            showDivisionHints(problem);
            break;
    }
}

function showAdditionHints(problem) {
    const carries = calculateAdditionCarries(problem);
    displayCarries(carries);
}

function showSubtractionHints(problem) {
    const borrows = calculateSubtractionBorrows(problem);
    displayBorrows(borrows);
}

function showMultiplicationHints(problem) {
    const steps = calculateMultiplicationSteps(problem);
    displayIntermediateSteps(steps);
}

function showDivisionHints(problem) {
    const steps = calculateDivisionSteps(problem);
    displayIntermediateSteps(steps);
}

function calculateAdditionCarries(problem) {
    const num1Str = problem.num1.toString();
    const num2Str = problem.num2.toString();
    const carries = [];
    let carry = 0;
    
    for (let i = 1; i <= Math.max(num1Str.length, num2Str.length); i++) {
        const digit1 = parseInt(num1Str[num1Str.length - i]) || 0;
        const digit2 = parseInt(num2Str[num2Str.length - i]) || 0;
        const sum = digit1 + digit2 + carry;
        
        carry = Math.floor(sum / 10);
        if (carry > 0) {
            carries.unshift(carry);
        } else {
            carries.unshift('');
        }
    }
    
    return carries;
}

function calculateSubtractionBorrows(problem) {
    const num1Str = problem.num1.toString();
    const num2Str = problem.num2.toString();
    const borrows = [];
    let borrow = 0;
    
    for (let i = 1; i <= num1Str.length; i++) {
        const digit1 = parseInt(num1Str[num1Str.length - i]) - borrow;
        const digit2 = parseInt(num2Str[num2Str.length - i]) || 0;
        
        if (digit1 < digit2) {
            borrows.unshift('1');
            borrow = 1;
        } else {
            borrows.unshift('');
            borrow = 0;
        }
    }
    
    return borrows;
}

function calculateMultiplicationSteps(problem) {
    const num1Str = problem.num1.toString();
    const num2Str = problem.num2.toString();
    const steps = [];
    let carry = 0;
    
    for (let i = num2Str.length - 1; i >= 0; i--) {
        const digit2 = parseInt(num2Str[i]);
        let stepResult = '';
        carry = 0;
        
        for (let j = num1Str.length - 1; j >= 0; j--) {
            const digit1 = parseInt(num1Str[j]);
            const product = digit1 * digit2 + carry;
            stepResult = (product % 10) + stepResult;
            carry = Math.floor(product / 10);
        }
        
        if (carry > 0) {
            stepResult = carry + stepResult;
        }
        
        // Aggiungi gli zeri di riempimento per l'allineamento
        stepResult = stepResult + '0'.repeat(num2Str.length - 1 - i);
        steps.push(stepResult);
    }
    
    return steps;
}

function calculateDivisionSteps(problem) {
    const dividend = problem.num1;
    const divisor = problem.num2;
    const steps = [];
    let currentDividend = 0;
    let dividendStr = dividend.toString();
    
    for (let i = 0; i < dividendStr.length; i++) {
        currentDividend = currentDividend * 10 + parseInt(dividendStr[i]);
        const quotient = Math.floor(currentDividend / divisor);
        const remainder = currentDividend % divisor;
        
        steps.push({
            quotient,
            remainder,
            position: i
        });
        
        currentDividend = remainder;
    }
    
    return steps;
}

function displayCarries(carries) {
    const carriesRow = document.querySelector('.carries-row');
    carriesRow.innerHTML = carries.map(carry => 
        `<div class="carry">${carry}</div>`
    ).join('');
    carriesRow.style.display = 'flex';
}

function displayBorrows(borrows) {
    const borrowsRow = document.querySelector('.carries-row');
    borrowsRow.innerHTML = borrows.map(borrow => 
        `<div class="borrow">${borrow}</div>`
    ).join('');
    borrowsRow.style.display = 'flex';
}

function displayIntermediateSteps(steps) {
    const stepsContainer = document.querySelector('.intermediate-steps');
    stepsContainer.innerHTML = '';
    
    if (gameState.operation === 'moltiplicazione') {
        steps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'multiplication-step';
            stepDiv.textContent = step;
            stepsContainer.appendChild(stepDiv);
        });
    } else if (gameState.operation === 'divisione') {
        steps.forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'division-step';
            stepDiv.innerHTML = `
                <span>Passo ${index + 1}: </span>
                <span>${step.quotient} (resto: ${step.remainder})</span>
            `;
            stepsContainer.appendChild(stepDiv);
        });
    }
    
    stepsContainer.style.display = 'block';
}

function hideHints() {
    document.querySelector('.carries-row').style.display = 'none';
    document.querySelector('.intermediate-steps').style.display = 'none';
}

function clearFeedback() {
    const feedback = document.querySelector('.feedback');
    if (feedback) {
        feedback.textContent = '';
        feedback.className = 'feedback';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Gestione della navigazione con tastiera
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement.classList.contains('digit-input')) {
                checkAnswer();
            }
        }
    });
    
    // Gestione del focus degli input
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('digit-input')) {
            e.target.select();
        }
    });
});