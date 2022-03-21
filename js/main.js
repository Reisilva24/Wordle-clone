document.addEventListener("DOMContentLoaded", () => {
  let guessedWords = [[]];
  let availableSpace = 1;
  let isGaiming = true;

  let word = 'Sarajevo'.toUpperCase();
  let wordGuessing = word;
  let guessedWordCount = 0;
  let NUM_OPPORTUNITIES = 6;

  let MAX_LENGTH = word.length;

  adaptMaxLength();
  createSquares();

  function getCurrentWordArr() {
    const numberOfGuessedWords = guessedWords.length;
    return guessedWords[numberOfGuessedWords - 1];
  }

  function updateGuessedWords(letter) {
    const currentWordArr = getCurrentWordArr();

    if (currentWordArr && currentWordArr.length < MAX_LENGTH) {
      currentWordArr.push(letter);

      const availableSpaceEl = document.getElementById(String(availableSpace));

      availableSpace = availableSpace + 1;
      availableSpaceEl.textContent = letter;
    }
  }

  function getTileColor(letter, index) {
    var isCorrectLetter = false;

    if (wordGuessing.includes(letter)) {
      var position = wordGuessing.indexOf(letter);
      wordGuessing = wordGuessing.substring(0, position) + wordGuessing.substring(position + 1, wordGuessing.length);
      isCorrectLetter = true;
    }

    if (!isCorrectLetter) {
      return "rgb(58, 58, 60)";
    }

    const letterInThatPosition = word.charAt(index);
    const isCorrectPosition = letter === letterInThatPosition;

    if (isCorrectPosition) {
      return "rgb(83, 141, 78)";
    }

    return "rgb(181, 159, 59)";
  }

  function handleSubmitWord() {
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr.length !== MAX_LENGTH) {
      window.alert("Word must be " + MAX_LENGTH + " letters");
    } else {
      const currentWord = currentWordArr.join("");

      const firstLetterId = guessedWordCount * MAX_LENGTH + 1;
      const interval = 200;
      currentWordArr.forEach((letter, index) => {
        setTimeout(() => {
          const tileColor = getTileColor(letter, index);

          const letterId = firstLetterId + index;
          const letterEl = document.getElementById(letterId);
          letterEl.classList.add("animate__flipInX");
          letterEl.style = `background-color:${tileColor};border-color:${tileColor}; color:rgb(248,248,248)`;
        }, interval * index);
      });

      guessedWordCount += 1;

      if (currentWord === word) {
        window.alert("Congratulations!");
        isGaiming = false;
      }
      else if (guessedWords.length >= NUM_OPPORTUNITIES) {
        window.alert(`Sorry, you have no more guesses! The word is ${word}.`);
        isGaiming = false;
      }

      wordGuessing = word;
      guessedWords.push([]);
    }


  }

  function createSquares() {
    const gameBoard = document.getElementById("board");
    for (let index = 0; index < (NUM_OPPORTUNITIES * MAX_LENGTH); index++) {
      let square = document.createElement("div");
      square.classList.add("square");
      square.classList.add("animate__animated");
      square.setAttribute("id", index + 1);
      gameBoard.appendChild(square);
    }
  }

  function handleDeleteLetter() {
    const currentWordArr = getCurrentWordArr();
    if (currentWordArr.length > 0) {
      currentWordArr.pop();
      guessedWords[guessedWords.length - 1] = currentWordArr;
      const lastLetterEl = document.getElementById(String(availableSpace - 1));
      lastLetterEl.textContent = "";
      availableSpace = availableSpace - 1;
    }
  }

  function adaptMaxLength() {
    document.getElementById('board').style.setProperty('grid-template-columns', 'repeat(' + MAX_LENGTH + ',1fr');
  }

  document.addEventListener('keydown', (event) => {
    var name = event.key;
    var code = event.code;

    if (isGaiming) {
      if (code === "Enter") {
        handleSubmitWord();
        return;
      }

      if (code === "Backspace") {
        handleDeleteLetter();
        return;
      }

      if (code.includes('Key')) {
        updateGuessedWords(name.toUpperCase());
      }
    }
  }, false)
});
