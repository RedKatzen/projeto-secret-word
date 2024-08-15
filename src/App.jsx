import "./App.css";

import { useCallback, useEffect, useState } from "react";

import Game from "./components/Game";
import GameOver from "./components/GameOver";
import StartScreen from "./components/StartScreen";
import { wordsList } from "./data/words";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQtn = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQtn);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];
    return { word, category };
  }, [words]);

  console.log(pickedWord);

  const startGame = useCallback(() => {
    clearLetterState();

    const { word, category } = pickWordAndCategory();
    console.log(category, word);

    let wordLetters = word.split("");

    wordLetters = wordLetters.map((letter) => letter.toLowerCase());

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    console.log(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterState = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  }

  // useEffect irá monitorar a variável guesses
  // e quando ela for menor ou igual a 0, irá chamar a função setGameStage
  useEffect(() => {
    if(guesses <= 0){
      clearLetterState();

      setGameStage(stages[2].name);
    }
  }, [guesses])

  useEffect(() => {
    const uniqueLetters = [... new Set(letters)];

    if(guessedLetters.length === uniqueLetters.length){
      setScore((actualScore) => (actualScore += 100));

      startGame();
    }
  }, [guessedLetters, startGame, letters])

  const retry = () => {
    setScore(0);
    setGuesses(guessesQtn);

    setGameStage(stages[0].name);
  };

  return (
    <div className="app">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
