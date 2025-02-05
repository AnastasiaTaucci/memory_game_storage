// Game variables
let symbols = ['🍎', '🍌', '🍒', '🍇', '🍉', '🍓', '🥝', '🍑'];
let moves = 0;
let totalMoves = localStorage.getItem('totalMoves') ? parseInt(localStorage.getItem('totalMoves')) : 0;
let flippedCards = [];
let matchedPairs = 0;
let isProcessing = false; // Flag to disable clicks during processing
let flipSound = new Audio('./sounds/flip.mp3');
let matchSound = new Audio('./sounds/success.mp3');
let congratsSound = new Audio('./sounds/congrats.mp3');

// DOM elements
const gameBoard = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const totalScoreDisplay = document.getElementById('total-moves');
const restartBtn = document.getElementById('restart-btn');
const colorSelector = document.getElementById('chosen-color');

// function to save game state in sessionStorage
function saveGameState() {

  let gameState = {
    moves,
    totalMoves,
    matchedPairs,
    selectedColor: colorSelector.value,
    cards: Array.from(gameBoard.children).map(card => {
      return {
        symbol: card.dataset.symbol,
        flipped: card.classList.contains("flipped")
      }
    })
  }

  sessionStorage.setItem('memoryGameState', JSON.stringify(gameState));
}

// function to load state from sessionStorage
function loadGameState() {

  let savedState = sessionStorage.getItem('memoryGameState');

  if (savedState) {
    console.log("savedState exists");
    let gameState = JSON.parse(savedState);

    moves = gameState.moves;
    totalMoves = localStorage.getItem('totalMoves') ? parseInt(localStorage.getItem('totalMoves')) : 0;
    scoreDisplay.textContent = "Moves: " + moves;
    totalScoreDisplay.textContent = "Total Moves: " + totalMoves;

    matchedPairs = gameState.matchedPairs;

    gameBoard.innerHTML = "";
    flippedCards = [];

    let deck = gameState.cards;
    //clear board and recteate saved state
    deck.forEach(cardData => {
      let card = createCard(cardData.symbol);
      if (cardData.flipped) {
        card.classList.add("flipped");
        card.textContent = cardData.symbol;
      }
      gameBoard.appendChild(card);
    });

    colorSelector.value = gameState.selectedColor;
    changeColor();

  } else {
    initializeGame();
  }
}


// Function to create cards
function createCard (symbol) {
  let card = document.createElement('div');
  card.classList.add('card');
  card.dataset.symbol = symbol;

  //determine the selected color
  
  let cValue = colorSelector.value;
  card.classList.add(cValue);

  return card;
};

// Function to initialize the game
function initializeGame () {
  // Reset game variables
  moves = 0;
  totalMoves = localStorage.getItem('totalMoves') ? parseInt(localStorage.getItem('totalMoves')) : 0;
  flippedCards = [];
  matchedPairs = 0;
  isProcessing = false;


  // Update score display
  scoreDisplay.textContent = "Moves: " + moves;
  totalScoreDisplay.textContent = "Total Moves: " + totalMoves;

  // Shuffle symbols
  let deck = symbols.concat(symbols);

  for (let i = 0; i < deck.length; i++) {
    let randomIndex1 = Math.floor(deck.length * Math.random());
    let randomIndex2 = Math.floor(deck.length * Math.random());

    let temp = deck[randomIndex1];
    deck[randomIndex1] = deck[randomIndex2];
    deck[randomIndex2] = temp;    
  }

  // Clear the board
  gameBoard.innerHTML = ''; 

  //create array of divs(class card) and append each to the gameboard div
  deck.map(createCard).forEach(card => gameBoard.appendChild(card));

  saveGameState();

};

// Event handling: flipping cards
gameBoard.addEventListener('click', (event) => {
  let clickedCard = event.target;

  if ( isProcessing || 
    !clickedCard.classList.contains('card') || 
    clickedCard.classList.contains('flipped')) {
    return;
  }

  //plays flip sound when a card is flipped
  flipSound.currentTime = 0; // Ensure sound plays fully each time
  flipSound.play();

  clickedCard.classList.add('flipped');
  clickedCard.textContent = clickedCard.dataset.symbol;
  flippedCards.push(clickedCard);

  if (flippedCards.length === 2) {
    moves++;
    totalMoves++;
    localStorage.setItem("totalMoves", totalMoves);
    scoreDisplay.textContent = "Moves: " + moves;
    totalScoreDisplay.textContent = "Total Moves: " + totalMoves;
    let firstCard = flippedCards[0];
    let secondCard = flippedCards[1];
    console.log(firstCard.classList);
    console.log(secondCard.classList);

    

    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
      matchedPairs++;

      matchSound.currentTime = 0; // ensures sound plays fully each time
      matchSound.play();

      flippedCards = [];
      if (matchedPairs === symbols.length) {
        congratsSound.play();
        setTimeout(() => {
          alert("🎉 Good Job! You completed the game in " + moves + " moves.");
        },250)
      }
    } else {
      isProcessing = true;
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.classList.remove('flipped');
        secondCard.textContent = '';
        flippedCards = [];
        isProcessing = false;
        console.log(firstCard.classList);
        console.log(secondCard.classList);

        saveGameState();
        console.log("this runs when deleting flipped");
      }, 700);
    }
  }
  saveGameState();
    
    //console.log("this runs after one card is flipped");  
});



// function to change card color
function changeColor() {

  //determine the selected color
  
  let cValue =  colorSelector.value;
  
  //get all cards and update their color
  document.querySelectorAll(".card").forEach(card => {
    // removing all previous color classes
    card.classList.remove("green", "blue", "pink");

    card.classList.add(cValue);
  });

  saveGameState();
}

// Sync total moves across tabs when another tab updates it
window.addEventListener('storage', (event) => {
  if (event.key === 'totalMoves') {
    totalMoves = parseInt(event.newValue);
    totalScoreDisplay.textContent = "Total Moves: " + totalMoves;
  }
});



//choose color event listener
colorSelector.addEventListener('change', changeColor);


// Restart button event listener
restartBtn.addEventListener('click', () => {
  sessionStorage.clear();
  initializeGame();
});


// Initialize the game on page load
window.addEventListener('load', loadGameState);











