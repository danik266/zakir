"use client";
import React from "react";
import "./ChristmasTree.css";

const elements = 128;
const layers = 7;

export default function ChristmasTree() {
  const starPoints = Array.from({ length: 5 });
  const treeElements = Array.from({ length: elements });
  const colors = ["#D8334A", "#FFCE54", "#2ECC71", "#5D9CEC", "#F39C12", "#9B59B6"];

  return (
    <div className="relative w-full h-screen overflow-hidden flex justify-center items-start">
      {/* Звезда */}
      {/* Звезда без дырки */}
<div className="absolute top-[15vh] w-12 h-12">
  <div
    className="w-full h-full bg-yellow-400"
    style={{
      clipPath:
        "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
    }}
  ></div>
</div>


      {/* Елка */}
      <ul className="relative w-[1px] h-full">
        {treeElements.map((_, i) => {
          const height = `calc(60vh * (${i + 4} / (${elements + 4})))`;
          const delay = `-${(4 * (i / (elements / layers)))}s`;
          const colorIndex = i % colors.length;
          const leftOffset = (Math.random() - 0.5) * 20; // разброс веток
          return (
            <li
              key={i}
              className="absolute top-[20vh] w-[2px] origin-top animate-swing"
              style={{
                height,
                animationDelay: delay,
                background: `linear-gradient(rgba(46,204,113,0), ${colors[colorIndex]}33)`,
                right: `calc(50% + ${leftOffset}px)`,
              }}
            >
              <span
                className="absolute left-[-2px] bottom-[1px] w-[4px] h-[4px] rounded-full animate-blink"
                style={{ backgroundColor: colors[colorIndex] }}
              ></span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
