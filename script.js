const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');
const winModal = document.getElementById('win-modal');
const playAgainBtn = document.getElementById('play-again-btn');
const finalMoves = document.getElementById('final-moves');
const finalTime = document.getElementById('final-time');

// Game State
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let timerInterval = null;
let isLocked = false;

// Emojis for cards (8 pairs)
const emojis = ['🚀', '🪐', '👽', '⭐', '🌙', '☄️', '🛸', '🌌'];

function initGame() {
    // Reset State
    cards = [...emojis, ...emojis];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    timer = 0;
    isLocked = false;
    
    // Update UI
    movesDisplay.textContent = moves;
    timerDisplay.textContent = '00:00';
    winModal.classList.add('hidden');
    clearInterval(timerInterval);
    startTimer();

    // Shuffle and Deal
    shuffle(cards);
    renderBoard();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderBoard() {
    gameBoard.innerHTML = '';
    cards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;
        card.dataset.value = emoji;

        card.innerHTML = `
            <div class="card-face card-front"></div>
            <div class="card-face card-back">${emoji}</div>
        `;

        card.addEventListener('click', handleCardClick);
        gameBoard.appendChild(card);
    });
}

function handleCardClick(e) {
    const card = e.currentTarget;

    // Ignore if locked, already flipped, or already matched
    if (isLocked || 
        card.classList.contains('flipped') || 
        card.classList.contains('matched')) {
        return;
    }

    flipCard(card);
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;
        checkMatch();
    }
}

function flipCard(card) {
    card.classList.add('flipped');
}

function checkMatch() {
    isLocked = true;
    const [card1, card2] = flippedCards;
    const match = card1.dataset.value === card2.dataset.value;

    if (match) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    flippedCards.forEach(card => {
        card.classList.add('matched');
        // Optional: Add a visual effect for match
        card.querySelector('.card-back').style.background = '#dcfce7'; // Light green
        card.querySelector('.card-back').style.borderColor = '#22c55e';
    });
    
    flippedCards = [];
    matchedPairs++;
    isLocked = false;

    if (matchedPairs === emojis.length) {
        endGame();
    }
}

function unflipCards() {
    setTimeout(() => {
        flippedCards.forEach(card => card.classList.remove('flipped'));
        flippedCards = [];
        isLocked = false;
    }, 1000);
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
        const seconds = (timer % 60).toString().padStart(2, '0');
        timerDisplay.textContent = `${minutes}:${seconds}`;
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);
    setTimeout(() => {
        finalMoves.textContent = moves;
        finalTime.textContent = timerDisplay.textContent;
        winModal.classList.remove('hidden');
    }, 500);
}

// Event Listeners
restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);

// Start Game on Load
initGame();
