import React, { useState, useEffect, useCallback } from 'react';
import AnalogClock from './components/AnalogClock';

function App() {
  const [targetTime, setTargetTime] = useState(new Date());
  const [guessHour, setGuessHour] = useState('');
  const [guessMinute, setGuessMinute] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string; type: 'correct' | 'incorrect' | 'info' }>({ message: 'Guess the time shown on the clock!', type: 'info' });

  const generateRandomTime = useCallback(() => {
    const randomHour = Math.floor(Math.random() * 24);
    const randomMinute = Math.floor(Math.random() * 60);
    const newTime = new Date();
    newTime.setHours(randomHour, randomMinute, 0, 0);
    setTargetTime(newTime);
    setGuessHour('');
    setGuessMinute('');
    setFeedback({ message: 'A new time! What is it?', type: 'info' });
  }, []);

  useEffect(() => {
    generateRandomTime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkGuess = () => {
    if (guessHour === '' || guessMinute === '') {
      setFeedback({ message: 'Please enter both hour and minute.', type: 'incorrect' });
      return;
    }

    const guessHourNum = parseInt(guessHour, 10);
    const guessMinuteNum = parseInt(guessMinute, 10);

    if (isNaN(guessHourNum) || isNaN(guessMinuteNum) || guessHourNum < 1 || guessHourNum > 12 || guessMinuteNum < 0 || guessMinuteNum > 59) {
      setFeedback({ message: 'Please enter a valid time (hour 1-12, minute 0-59).', type: 'incorrect' });
      return;
    }

    const targetHour = targetTime.getHours();
    const targetMinute = targetTime.getMinutes();
    
    let targetHour12h = targetHour % 12;
    if (targetHour12h === 0) {
      targetHour12h = 12; // 0 o'clock is 12 on an analog clock
    }

    if (guessHourNum === targetHour12h && guessMinuteNum === targetMinute) {
      const formattedTime = `${String(targetHour12h)}:${String(targetMinute).padStart(2, '0')}`;
      setScore(prev => prev + 1);
      setFeedback({ message: `Correct! It was ${formattedTime}. Well done!`, type: 'correct' });
      setTimeout(generateRandomTime, 2000);
    } else {
      const correctTime = `${String(targetHour12h)}:${String(targetMinute).padStart(2, '0')}`;
      setScore(prev => prev - 1);
      setFeedback({ message: `Not quite! The correct time was ${correctTime}.`, type: 'incorrect' });
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

  return (
    <div className="min-h-screen bg-sky-100 flex flex-col items-center justify-center p-4 font-sans antialiased">
      <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Time Teller Game</h1>
          <p className="text-slate-500 mt-2">Can you read the clock?</p>
        </header>

        <main className="flex flex-col items-center">
          <AnalogClock time={targetTime} />
          
          <div className="w-full">
            <div className={`p-3 mb-4 rounded-lg border ${feedbackColors[feedback.type]} transition-all duration-300`}>
              <p className="font-semibold">{feedback.message}</p>
            </div>

            <div className="flex flex-col items-center gap-4 mb-4">
              <div className="flex items-center justify-center gap-2">
                <input
                  type="text"
                  value={guessHour}
                  onChange={(e) => setGuessHour(e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
                  onKeyPress={handleKeyPress}
                  className="w-24 p-3 border-2 border-slate-300 rounded-lg text-2xl text-center focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="HH"
                  aria-label="Guess hour"
                  maxLength={2}
                />
                <span className="text-3xl font-bold text-slate-400 pb-1">:</span>
                <input
                  type="text"
                  value={guessMinute}
                  onChange={(e) => setGuessMinute(e.target.value.replace(/[^0-9]/g, '').slice(0, 2))}
                  onKeyPress={handleKeyPress}
                  className="w-24 p-3 border-2 border-slate-300 rounded-lg text-2xl text-center focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="MM"
                  aria-label="Guess minute"
                  maxLength={2}
                />
              </div>
              <button
                onClick={checkGuess}
                className="w-full px-6 py-3 bg-sky-500 text-white font-bold rounded-lg text-xl hover:bg-sky-600 transition-transform transform hover:scale-105 shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
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