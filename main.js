document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("game-board");
  const winMessage = document.getElementById("win-message");
  const instructions = document.getElementById("instructions");
  const playAgainButton = document.getElementById("play-again");
  const incorrectGuessesElement = document.getElementById("incorrect-guesses");

  const cards = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const shuffledCards = shuffleArray(cards.concat(cards));

  createBoard();
  let flipping = false;
  let badMatchesCount = 0;
  const maxBadMatches = 10;
  let matchedPairsCount = 0;

  function createBoard() {
    for (let card of shuffledCards) {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");
      cardElement.dataset.value = card;
      cardElement.innerText = " ";

      cardElement.addEventListener("click", flipCard);

      board.appendChild(cardElement);
    }
  }

  let firstCard = null;
  let secondCard = null;

  function flipCard() {
    if (flipping) return;
    if (!firstCard) {
      firstCard = this;
      firstCard.innerText = firstCard.dataset.value;
    } else {
      secondCard = this;
      secondCard.innerText = secondCard.dataset.value;
      if (firstCard.dataset.value === secondCard.dataset.value) {
        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matchedPairsCount++;
        setTimeout(() => {
          resetCards();
        }, 500);
      } else {
        setTimeout(() => {
          if (firstCard) {
            firstCard.innerText = " ";
          }
          if (secondCard) {
            secondCard.innerText = " ";
          }
          resetCards();
          badMatchesCount++;
          updateIncorrectGuesses();
          checkForLose();
        }, 500);
      }
    }
  }

  function resetCards() {
    firstCard = null;
    secondCard = null;
    checkForWin();
  }

  function updateIncorrectGuesses() {
    incorrectGuessesElement.innerText = `Incorrect Guesses: ${badMatchesCount}`;
  }

  function displayInstructions(show) {
    instructions.style.display = show ? "block" : "none";
  }

  displayInstructions(true);

  function displayWinMessage() {
    winMessage.style.display = "flex";
    winMessage.style.color = "rgb(37, 37, 153)";
    winMessage.style.fontSize = "50px";
    winMessage.style.webkitTextStroke = "1px white";
    winMessage.style.textAlign = "center";

    playAgainButton.style.display = "block";
    playAgainButton.addEventListener("click", playAgain);
  }

  function checkForWin() {
    console.log("Checking for win...");
    if (matchedPairsCount === cards.length) {
      displayWinMessage();
      displayInstructions(false);
    }
  }

  function checkForLose() {
    if (badMatchesCount >= maxBadMatches) {
      loseGame();
    }
  }

  function loseGame() {
    instructions.innerHTML = "Sorry, you lost the game. Try again!";
    instructions.style.display = "block";
    playAgainButton.style.display = "block";
    playAgainButton.addEventListener("click", playAgain);
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function playAgain() {
    winMessage.style.display = "none";
    playAgainButton.style.display = "none";
    board.innerHTML = "";
    flipping = false;
    matchedPairsCount = 0;

    badMatchesCount = 0;
    updateIncorrectGuesses();

    const shuffledCards = shuffleArray(cards.concat(cards));
    createBoard();

    firstCard = null;
    secondCard = null;

    instructions.innerHTML =
      "~ Click any card to flip over. Match all the cards to win. ~";
    instructions.style.display = "block";

    displayInstructions(true);
  }
});
