import React from 'react';

interface AnalogClockProps {
  time: Date;
  numeralType: 'roman' | 'decimal';
  showSeconds: boolean;
  ampm?: 'AM' | 'PM';
}

const AnalogClock: React.FC<AnalogClockProps> = ({ time, numeralType, showSeconds, ampm }) => {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hoursRotation = (hours % 12) * 30 + minutes * 0.5;
  const minutesRotation = minutes * 6 + seconds * 0.1; // Make minute hand move smoothly with seconds
  const secondsRotation = seconds * 6;

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const decimalNumerals = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  const numerals = numeralType === 'roman' ? romanNumerals : decimalNumerals;

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full border-8 border-slate-700 bg-slate-100 shadow-2xl flex items-center justify-center my-8">
      {Array.from({ length: 12 }, (_, i) => {
        const num = i + 1;
        const angleRad = (num * 30 - 90) * (Math.PI / 180);
        const radius = 42;
        const x = `${50 + radius * Math.cos(angleRad)}%`;
        const y = `${50 + radius * Math.sin(angleRad)}%`;
        const numeral = numerals[i];
        const isMajor = num % 3 === 0;

        return (
          <div
            key={num}
            className={`absolute font-serif -translate-x-1/2 -translate-y-1/2 ${
              isMajor
                ? 'text-2xl md:text-3xl font-black text-slate-900'
                : 'text-lg md:text-xl font-bold text-slate-700'
            }`}
            style={{ top: y, left: x }}
          >
            {numeral}
          </div>
        );
      })}
      
      {/* Hour Hand */}
      <div 
        className="absolute top-1/2 left-1/2 w-1.5 h-16 md:h-20 bg-slate-800 rounded-t-lg origin-bottom z-10"
        style={{ 
          transform: `translateX(-50%) translateY(-100%) rotate(${hoursRotation}deg)` 
        }}
      />
      
      {/* Minute Hand */}
      <div 
        className="absolute top-1/2 left-1/2 w-1 h-24 md:h-28 bg-slate-600 rounded-t-lg origin-bottom z-10"
        style={{ 
          transform: `translateX(-50%) translateY(-100%) rotate(${minutesRotation}deg)`
        }}
      />

      {/* Second Hand */}
      {showSeconds && (
        <div 
          className="absolute top-1/2 left-1/2 w-0.5 h-24 md:h-28 bg-red-500 rounded-t-lg origin-bottom z-10"
          style={{ 
            transform: `translateX(-50%) translateY(-100%) rotate(${secondsRotation}deg)`
          }}
        />
      )}
      
      {/* AM/PM Indicator */}
      {ampm && (
        <div className="absolute top-[65%] left-1/2 -translate-x-1/2 bg-slate-700 text-white text-xs md:text-sm font-bold px-2 py-0.5 rounded shadow-inner z-5">
            {ampm}
        </div>
      )}

      {/* Center dot */}
      <div className="absolute w-3 h-3 bg-slate-800 rounded-full z-20"></div>
    </div>
  );
};

export default AnalogClock;