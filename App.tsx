import React, { useState, useEffect, useCallback } from 'react';
import AnalogClock from './components/AnalogClock';

type Difficulty = 'easy' | 'medium' | 'hard';
type NumeralType = 'roman' | 'decimal';

function App() {
  const [targetTime, setTargetTime] = useState(new Date());
  const [guessHour, setGuessHour] = useState('');
  const [guessMinute, setGuessMinute] = useState('');
  const [guessSecond, setGuessSecond] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' | 'info' }>({ message: 'Guess the time shown on the clock!', type: 'info' });
  const [isRoundOver, setIsRoundOver] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [numeralType, setNumeralType] = useState<NumeralType>('roman');

  const generateRandomTime = useCallback(() => {
    const randomHour = Math.floor(Math.random() * 24);
    let randomMinute = 0;
    let randomSecond = 0;

    switch (difficulty) {
      case 'easy':
        randomMinute = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
        break;
      case 'hard':
        randomMinute = Math.floor(Math.random() * 60);
        randomSecond = Math.floor(Math.random() * 60);
        break;
      case 'medium':
      default:
        randomMinute = Math.floor(Math.random() * 60);
        break;
    }

    const newTime = new Date();
    newTime.setHours(randomHour, randomMinute, randomSecond, 0);
    setTargetTime(newTime);
    setGuessHour('');
    setGuessMinute('');
    setGuessSecond('');
    setFeedback({ message: 'A new challenge! Guess the time.', type: 'info' });
    setIsRoundOver(false);
  }, [difficulty]);

  useEffect(() => {
    generateRandomTime();
  }, [generateRandomTime]);

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  };

  const toggleNumeralType = () => {
    setNumeralType(prev => (prev === 'roman' ? 'decimal' : 'roman'));
  };

  const checkGuess = () => {
    if (isRoundOver) return;

    if (guessHour === '' || guessMinute === '') {
      setFeedback({ message: 'Please enter both hour and minute.', type: 'incorrect' });
      return;
    }
     if (difficulty === 'hard' && guessSecond === '') {
      setFeedback({ message: 'Please enter the seconds for hard mode.', type: 'incorrect' });
      return;
    }

    const guessHourNum = parseInt(guessHour, 10);
    const guessMinuteNum = parseInt(guessMinute, 10);
    const guessSecondNum = difficulty === 'hard' ? parseInt(guessSecond, 10) : 0;

    if (isNaN(guessHourNum) || isNaN(guessMinuteNum) || guessHourNum < 1 || guessHourNum > 12 || guessMinuteNum < 0 || guessMinuteNum > 59) {
      setFeedback({ message: 'Please enter a valid time (hour 1-12, minute 0-59).', type: 'incorrect' });
      return;
    }
     if (difficulty === 'hard' && (isNaN(guessSecondNum) || guessSecondNum < 0 || guessSecondNum > 59)) {
      setFeedback({ message: 'Please enter valid seconds (0-59).', type: 'incorrect' });
      return;
    }

    const targetHour = targetTime.getHours();
    const targetMinute = targetTime.getMinutes();
    const targetSecond = targetTime.getSeconds();
    
    let targetHour12h = targetHour % 12;
    if (targetHour12h === 0) {
      targetHour12h = 12;
    }

    let isCorrect = guessHourNum === targetHour12h && guessMinuteNum === targetMinute;
    if (difficulty === 'hard') {
        isCorrect = isCorrect && guessSecondNum === targetSecond;
    }
    
    if (isCorrect) {
      const correctTime = `${String(targetHour12h)}:${String(targetMinute).padStart(2, '0')}${difficulty === 'hard' ? ':' + String(targetSecond).padStart(2, '0') : ''}`;
      setScore(prev => prev + 1);
      setFeedback({ message: `Correct! It was ${correctTime}. Well done!`, type: 'correct' });
      setIsRoundOver(true);
      setTimeout(generateRandomTime, 2000);
    } else {
      const correctTime = `${String(targetHour12h)}:${String(targetMinute).padStart(2, '0')}${difficulty === 'hard' ? ':' + String(targetSecond).padStart(2, '0') : ''}`;
      setScore(prev => prev - 1);
      setFeedback({ message: `Not quite! The correct time was ${correctTime}. Try a new time!`, type: 'incorrect' });
      setIsRoundOver(true);
    }
  };
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      checkGuess();
    }
  };

  const feedbackColors = {
    correct: 'text-green-700 bg-green-100 border-green-400',
    incorrect: 'text-red-700 bg-red-100 border-red-400',
    info: 'text-blue-700 bg-blue-100 border-blue-400',
  };
  
  const difficultyConfig: Record<Difficulty, {label: string, description: string, color: string }> = {
    easy: { label: 'Easy', description: 'Ages < 6', color: 'bg-green-500 hover:bg-green-600' },
    medium: { label: 'Medium', description: 'Ages 6-8', color: 'bg-sky-500 hover:bg-sky-600' },
    hard: { label: 'Hard', description: 'Ages > 8', color: 'bg-red-500 hover:bg-red-600' },
  }

  const ampm = targetTime.getHours() >= 12 ? 'PM' : 'AM';

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col items-center justify-center p-4 font-sans antialiased">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Time Teller Game</h1>
          <p className="text-slate-500 mt-2">Select a difficulty and guess the time!</p>
        </header>

        <div className="my-6 grid grid-cols-3 gap-2">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map(level => (
                <button 
                    key={level}
                    onClick={() => handleDifficultyChange(level)}
                    className={`px-2 py-2 text-white font-bold rounded-lg shadow-md transition-all duration-200 ${difficultyConfig[level].color} ${difficulty === level ? 'ring-4 ring-offset-2 ring-yellow-400' : 'opacity-70 hover:opacity-100'}`}
                >
                    {difficultyConfig[level].label}
                    <span className="block text-xs font-normal">{difficultyConfig[level].description}</span>
                </button>
            ))}
        </div>

        <main className="flex flex-col items-center">
          <AnalogClock 
            time={targetTime} 
            numeralType={numeralType} 
            showSeconds={difficulty === 'hard'} 
            ampm={difficulty !== 'easy' ? ampm : undefined}
          />
           <button
              onClick={toggleNumeralType}
              className="mb-4 px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            >
              Switch to {numeralType === 'roman' ? 'Decimal' : 'Roman'} Numerals
            </button>
          
          <div className="w-full">
            <div className={`p-3 mb-4 rounded-lg border ${feedbackColors[feedback.type]} transition-all duration-300`}>
              <p className="font-semibold">{feedback.message}</p>
            </div>

            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="flex items-center justify-center gap-1">
                <input
                  type="text"
                  value={guessHour}
                  onChange={(e) => setGuessHour(e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
                  onKeyPress={handleKeyPress}
                  className="w-20 p-3 border-2 border-slate-300 rounded-lg text-2xl text-center focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition disabled:bg-slate-200 disabled:cursor-not-allowed"
                  placeholder="HH"
                  aria-label="Guess hour"
                  maxLength={2}
                  disabled={isRoundOver}
                />
                <span className="text-3xl font-bold text-slate-400 pb-1">:</span>
                <input
                  type="text"
                  value={guessMinute}
                  onChange={(e) => setGuessMinute(e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
                  onKeyPress={handleKeyPress}
                  className="w-20 p-3 border-2 border-slate-300 rounded-lg text-2xl text-center focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition disabled:bg-slate-200 disabled:cursor-not-allowed"
                  placeholder="MM"
                  aria-label="Guess minute"
                  maxLength={2}
                  disabled={isRoundOver}
                />
                 {difficulty === 'hard' && (
                  <>
                    <span className="text-3xl font-bold text-slate-400 pb-1">:</span>
                    <input
                      type="text"
                      value={guessSecond}
                      onChange={(e) => setGuessSecond(e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
                      onKeyPress={handleKeyPress}
                      className="w-20 p-3 border-2 border-slate-300 rounded-lg text-2xl text-center focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition disabled:bg-slate-200 disabled:cursor-not-allowed"
                      placeholder="SS"
                      aria-label="Guess second"
                      maxLength={2}
                      disabled={isRoundOver}
                    />
                  </>
                )}
              </div>
              <button
                onClick={checkGuess}
                disabled={isRoundOver}
                className="w-full px-6 py-3 bg-sky-500 text-white font-bold rounded-lg text-xl hover:bg-sky-600 transition-transform transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none"
              >
                Check
              </button>
            </div>

            <button
              onClick={generateRandomTime}
              className="w-full px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              New Time
            </button>
          </div>
        </main>

        <footer className="mt-6">
          <p className="text-2xl font-bold text-slate-800">Score: <span className="text-sky-600 w-12 inline-block transition-all">{score}</span></p>
        </footer>
      </div>
    </div>
  );
}

export default App;