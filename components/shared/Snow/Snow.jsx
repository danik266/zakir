"use client";

export default function Snow() {
  const snowflakes = Array.from({ length: 100 }); // больше снежинок

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {snowflakes.map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full opacity-80 animate-fall"
          style={{
            width: `${Math.random() * 5 + 2}px`,
            height: `${Math.random() * 5 + 2}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * -100}px`, // стартовая позиция выше экрана
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${Math.random() * 10 + 5}s`,
          }}
        ></div>
      ))}
    </div>
  );
}
