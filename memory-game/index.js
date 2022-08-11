const cards = document.querySelectorAll('.memory-card');
let firstCard, secondCard;
let isFlipped = false;
let lockBoard = false;
const gameField = document.getElementById('game-field');
const resultsTable = document.getElementById('results');
let resultsList = document.getElementById('results-list');
let score = 0;
const newGameButton = document.getElementById('new-game-button');

function setLocalStorage() {
    let storedResults = JSON.parse(localStorage.getItem('results')) || [];
    if (storedResults.length === 10) {
        storedResults.splice(0, 1);
    }
    storedResults.push(score);
    localStorage.setItem('results', JSON.stringify(storedResults));
}

function getLocalStorage() {
    let storedResults = JSON.parse(localStorage.getItem('results'));
    return storedResults;
}

function mixCard() {
    cards.forEach(card => {
        let position = Math.floor(Math.random() * 16);
        card.style.order = position;
        card.addEventListener('click', flipCard);
    })
}
mixCard();

function resetBoard() {
    isFlipped = false;
    lockBoard = false;
    firstCard = null;
    secondCard = null;
}

function stayFrontFace() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function matchCheck() {
    if (firstCard.dataset.animal === secondCard.dataset.animal) {
        return stayFrontFace();
    } else {
        unflipCards();
    }
}

function flipCard() {
    if (lockBoard || this === firstCard) {
        return;
    } 
    this.classList.add('flip');
    score += 1;
    if (!isFlipped) {
        isFlipped = true;
        return firstCard = this;
    } else {
        isFlipped = false;
        secondCard = this;
        matchCheck();
    }
    let flippedCards = document.querySelectorAll('.flip');
    if (flippedCards.length === 16) {
        setLocalStorage();
        gameField.style.display = "none";
        resultsTable.style.display = "flex";
        writeResult();
    }
}      

function writeResult() {
    let prevResults = getLocalStorage();
    let template = prevResults.map(score => `<li class="score"><span>${score} clicks</span></li>`)
    resultsList.innerHTML = "";
    resultsList.insertAdjacentHTML('beforeend', template.join(""));
}

function newGame() {
    score = 0;
    cards.forEach(card => {
        card.classList.remove('flip');
    })
    mixCard();
    gameField.style.display = "flex";
    resultsTable.style.display = "none";
}
newGameButton.addEventListener('click', newGame);