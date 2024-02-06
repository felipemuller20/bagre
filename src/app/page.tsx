"use client";

import { useState, useEffect } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

export default function Home() {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [daysDuration, setDaysDuration] = useState<number | null>(null);

  const daySeconds = 86400;
  const hourSeconds = 3600;
  const minuteSeconds = 60;

  const [size, setSize] = useState(75);

  useEffect(() => {
    function handleResize() {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setSize(120);
      } else {
        setSize(75);
      }
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // chama a função imediatamente para definir o tamanho inicial

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const startTime = Date.now() / 1000; // use UNIX timestamp in seconds
    const endTime = new Date("2024-07-31T00:00:00").getTime() / 1000;
    const remainingTime = endTime - startTime;
    const days = Math.ceil(remainingTime / daySeconds);
    const daysDuration = days * daySeconds;

    setStartTime(startTime);
    setEndTime(endTime);
    setRemainingTime(remainingTime);
    setDaysDuration(daysDuration);
  }, []);

  const timerProps = {
    isPlaying: true,
    size: 120,
    strokeWidth: 6,
  };

  const renderTime = (dimension: string, time: number) => {
    return (
      <div className="flex flex-col items-center justify-center text-gray-300 text-xs md:text-base">
        <div>{time}</div>
        <div>{dimension}</div>
      </div>
    );
  };

  const getTimeSeconds = (time: number) => (minuteSeconds - time) | 0;
  const getTimeMinutes = (time: number) =>
    ((time % hourSeconds) / minuteSeconds) | 0;
  const getTimeHours = (time: number) =>
    ((time % daySeconds) / hourSeconds) | 0;
  const getTimeDays = (time: number) => (time / daySeconds) | 0;

  return (
    <div
      className="bg-gray-50 w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(/arena-gremio.jpeg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <main
        className="flex flex-col items-center justify-center gap-5 p-4 sm:p-10 rounded-lg"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      >
        <h1 className="text-base md:text-2xl text-gray-200">Faltam</h1>
        <div className="flex items-center justify-center gap-1 md:gap-10">
          {remainingTime && daysDuration ? (
            <>
              <CountdownCircleTimer
                {...timerProps}
                colors="#0995d4"
                duration={daysDuration}
                initialRemainingTime={remainingTime}
                size={size}
              >
                {({ elapsedTime, color }) => (
                  <div
                    style={{
                      color,
                    }}
                  >
                    {renderTime(
                      "dias",
                      getTimeDays(daysDuration - elapsedTime)
                    )}
                  </div>
                )}
              </CountdownCircleTimer>
              <CountdownCircleTimer
                {...timerProps}
                colors="#FFFFFF"
                duration={daySeconds}
                initialRemainingTime={remainingTime % daySeconds}
                onComplete={(totalElapsedTime) => ({
                  shouldRepeat: remainingTime - totalElapsedTime > hourSeconds,
                })}
                size={size}
              >
                {({ elapsedTime, color }) => (
                  <span style={{ color }}>
                    {renderTime(
                      "hours",
                      getTimeHours(daySeconds - elapsedTime)
                    )}
                  </span>
                )}
              </CountdownCircleTimer>
              <CountdownCircleTimer
                {...timerProps}
                colors="#231e1f"
                duration={hourSeconds}
                initialRemainingTime={remainingTime % hourSeconds}
                onComplete={(totalElapsedTime) => ({
                  shouldRepeat:
                    remainingTime - totalElapsedTime > minuteSeconds,
                })}
                size={size}
              >
                {({ elapsedTime, color }) => (
                  <span style={{ color }}>
                    {renderTime(
                      "minutes",
                      getTimeMinutes(hourSeconds - elapsedTime)
                    )}
                  </span>
                )}
              </CountdownCircleTimer>
              <CountdownCircleTimer
                {...timerProps}
                colors={["#0995d4", "#FFFFFF", "#231e1f"]}
                colorsTime={[59, 40, 20]}
                duration={minuteSeconds}
                initialRemainingTime={remainingTime % minuteSeconds}
                onComplete={(totalElapsedTime) => ({
                  shouldRepeat: remainingTime - totalElapsedTime > 0,
                })}
                size={size}
              >
                {({ elapsedTime, color }) => (
                  <span style={{ color }}>
                    {renderTime("seconds", getTimeSeconds(elapsedTime))}
                  </span>
                )}
              </CountdownCircleTimer>
            </>
          ) : (
            <p>Carregando...</p>
          )}
        </div>
        <h2 className="text-sm md:text-xl text-gray-200">
          Para o fim do período de empréstimo do jogador J. P. Galvão
        </h2>
      </main>
      {/* eslint-disable-next-line */}
      <img src="/bagre.png" className="w-40 h-auto" alt="J P Bagre" />
    </div>
  );
}
