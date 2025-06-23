"use client"
import React, { useEffect, useRef, useState } from 'react';

// Helper for animated number transitions
function useAnimatedNumber(target: number, duration = 800) {
  const [value, setValue] = useState(target);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    let start: number | null = null;
    const initial = value;
    const diff = target - initial;

    if (diff === 0) return;

    function animate(ts: number) {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      setValue(initial + diff * progress);
      if (progress < 1) {
        raf.current = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    }
    raf.current = requestAnimationFrame(animate);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line
  }, [target]);
  return value;
}

export default function Home() {
  // For day of year animation
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const isLeap = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };
  const daysInYear = isLeap(now.getFullYear()) ? 366 : 365;
  const animatedDayOfYear = useAnimatedNumber(dayOfYear, 1000);

  // For percent of day animation
  const getPercentOfDay = () => {
    const now = new Date();
    return (
      ((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) /
        (24 * 3600)) *
      100
    );
  };
  const [percentOfDay, setPercentOfDay] = useState(getPercentOfDay());
  const animatedPercentOfDay = useAnimatedNumber(percentOfDay, 800);

  // For right column animated numbers
  const getHoursPassed = () => {
    const now = new Date();
    return now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  };
  const [hoursPassed, setHoursPassed] = useState(getHoursPassed());
  const animatedHoursPassed = useAnimatedNumber(hoursPassed, 800);

  const getFridaysToGo = () => {
    const now = new Date();
    const year = now.getFullYear();
    let count = 0;
    const d = new Date(now);
    d.setHours(0,0,0,0);
    while (d.getFullYear() === year) {
      if (d.getDay() === 5) count++;
      d.setDate(d.getDate() + 1);
    }
    return count;
  };
  const [fridaysToGo, setFridaysToGo] = useState(getFridaysToGo());
  const animatedFridaysToGo = useAnimatedNumber(fridaysToGo, 800);

  const getMonthsPassed = () => {
    const now = new Date();
    return now.getMonth() + 1;
  };
  const [monthsPassed, setMonthsPassed] = useState(getMonthsPassed());
  const animatedMonthsPassed = useAnimatedNumber(monthsPassed, 800);

  const getPercentYearPassed = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
    return (
      ((now.getTime() - startOfYear.getTime()) /
        (endOfYear.getTime() - startOfYear.getTime())) *
      100
    );
  };
  const [percentYearPassed, setPercentYearPassed] = useState(getPercentYearPassed());
  const animatedPercentYearPassed = useAnimatedNumber(percentYearPassed, 800);

  // Animate updates every second for time-based values
  useEffect(() => {
    const interval = setInterval(() => {
      setPercentOfDay(getPercentOfDay());
      setHoursPassed(getHoursPassed());
      setFridaysToGo(getFridaysToGo());
      setMonthsPassed(getMonthsPassed());
      setPercentYearPassed(getPercentYearPassed());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Animate day-of-year at midnight
  useEffect(() => {
    const now = new Date();
    const msToMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0).getTime() -
      now.getTime();
    const timeout = setTimeout(() => {
      setTimeout(() => {
        setPercentOfDay(getPercentOfDay());
        setHoursPassed(getHoursPassed());
        setFridaysToGo(getFridaysToGo());
        setMonthsPassed(getMonthsPassed());
        setPercentYearPassed(getPercentYearPassed());
      }, 100);
    }, msToMidnight + 100);
    return () => clearTimeout(timeout);
  }, []);

  // Animate in with fade/slide for main sections
  // Tailwind: animate-fade-in, animate-slide-up, etc. (add custom classes if needed)
  // We'll use inline style for keyframes for simplicity

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-orange-50 to-pink-50">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes growBar {
          from { height: 0; }
          to { height: var(--bar-height);}
        }
        .grow-bar {
          animation: growBar 1s cubic-bezier(.4,0,.2,1) both;
        }
        @keyframes fadeIn {
          from { opacity: 0;}
          to { opacity: 1;}
        }
        .fade-in {
          animation: fadeIn 1s both;
        }
        @keyframes pulseCircle {
          0% { transform: scale(1);}
          50% { transform: scale(1.025);}
          100% { transform: scale(1);}
        }
        .pulse-circle {
          animation: pulseCircle 2.2s cubic-bezier(.4,0,.2,1) infinite;
        }
      `}</style>
      <div className="w-[calc(100vw-64px*2)] h-[calc(100vh-64px*2)] flex bg-white rounded-2xl" style={{ maxWidth: "100%", maxHeight: "100%" }}>
        <div className="w-1/3 h-full fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="w-full h-1/3"></div>
          <div className="w-full h-1/3 flex items-center">
            <div className="flex flex-col pl-16">
              <div
                className="text-gray-500 text-8xl font-bold transition-all duration-700"
                style={{
                  transition: 'color 0.7s, transform 0.7s',
                  color: '#6B7280',
                  transform: 'scale(1.08)',
                  animation: 'fadeInUp 1s cubic-bezier(.4,0,.2,1) both',
                }}
              >
                {Math.round(animatedDayOfYear)}
              </div>
              <div className="text-gray-400 text-2xl font-bold fade-in" style={{ animationDelay: '0.3s' }}>
                /{daysInYear}
              </div>
            </div>
          </div>
          <div className="w-full h-1/3"></div>
        </div>
        <div className="w-1/3 h-full flex-col flex justify-center fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="w-full h-1/8"></div>
          <div className="w-full aspect-square shadow-2xl rounded-full z-10 relative overflow-hidden fade-in-up pulse-circle" style={{ background: "linear-gradient(135deg, #FFE3D8, #FFD2C4)", animationDelay: '0.3s' }}>
            <div
              className="absolute left-0 bottom-0 w-full rounded-b-full grow-bar"
              style={{
                '--bar-height': `${animatedPercentOfDay}%`,
                height: `${animatedPercentOfDay}%`,
                background: "linear-gradient(135deg, #FEB472 0%,  #FE546A 100%)",
                transition: 'height 0.8s cubic-bezier(.4,0,.2,1)',
                animationDelay: '0.3s',
              } as React.CSSProperties}
            />
          </div>
          <div className="w-full h-1/8">
            {(() => {
              const now = new Date();
              const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
              const dates = [];
              for (let i = 0; i < 5; i++) {
                const d = new Date(now);
                d.setDate(now.getDate() + i);
                dates.push({
                  dayOfWeek: days[d.getDay()],
                  dayOfMonth: d.getDate(),
                });
              }
              return (
                <div className="text-center flex justify-center h-full font-bold items-center gap-8 fade-in-up" style={{ animationDelay: '0.5s' }}>
                  {dates.map((date, idx) => (
                    <div
                      key={idx}
                      className={idx === 0 ? "transition-all duration-500" : "text-gray-300 transition-all duration-500"}
                      style={{
                        transform: idx === 0 ? 'scale(1.15)' : 'scale(1)',
                        color: idx === 0 ? '#FE546A' : undefined,
                        transition: 'color 0.5s, transform 0.5s',
                      }}
                    >
                      <span>{date.dayOfWeek} <br /> {date.dayOfMonth}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
        <div className="w-1/3 h-full pr-16 fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex flex-col gap-4 h-full justify-center items-end pr-4">
            <div className="flex flex-col font-bold items-end fade-in-up" style={{ animationDelay: '0.4s' }}>
              <span className="text-xl transition-all duration-700" style={{ transition: 'color 0.7s, transform 0.7s', color: '#FE546A', transform: 'scale(1.08)' }}>
                {animatedHoursPassed.toFixed(2)}
              </span>
              <span className="text-gray-400">Hours passed today</span>
            </div>
            <div className="flex flex-col font-bold items-end fade-in-up" style={{ animationDelay: '0.5s' }}>
              <span className="text-xl transition-all duration-700" style={{ color: '#FEB472', transform: 'scale(1.08)' }}>
                {Math.round(animatedFridaysToGo)}
              </span>
              <span className="text-gray-400"> left this year</span>
            </div>
            <div className="flex flex-col font-bold items-end fade-in-up" style={{ animationDelay: '0.6s' }}>
              <span className="text-xl transition-all duration-700" style={{ color: '#FE546A', transform: 'scale(1.08)' }}>
                {Math.round(animatedMonthsPassed)}
              </span>
              <span className="text-gray-400">Months passed</span>
            </div>
            <div className="flex flex-col font-bold items-end fade-in-up" style={{ animationDelay: '0.7s' }}>
              <span className="text-xl transition-all duration-700" style={{ color: '#FEB472', transform: 'scale(1.08)' }}>
                {animatedPercentYearPassed.toFixed(2)}%
              </span>
              <span className="text-gray-400">Year progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
