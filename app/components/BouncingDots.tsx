"use client";

import React, { useEffect, useState, useRef } from "react";

interface BouncingDotsProps {
  rows: number;
  columns: number;
  svgWidth: number;
  svgHeight: number;
}

// Constants
const PROXIMITY_THRESHOLD = 300; // Changed from 100px to 300px

interface Dot {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  radius: number;
  hasNeighbors: boolean;
}

interface Connection {
  x1: number;
  y1: number;
  y2: number;
  x2: number;
}

export const BouncingDots: React.FC<BouncingDotsProps> = ({
  rows,
  columns,
  svgWidth,
  svgHeight,
}) => {
  const [dots, setDots] = useState<Dot[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // Initialize dots with positions and random velocities
  useEffect(() => {
    const gap = Math.min(svgWidth, svgHeight) / Math.max(rows, columns) / 2;
    const dotRadius = 5;
    const baseSpeed = 2;
    const initialDots: Dot[] = [];

    // Calculate the total width and height of the grid
    const gridWidth = columns * gap * 2;
    const gridHeight = rows * gap * 2;

    // Calculate the starting position to center the grid in the SVG
    const startX = (svgWidth - gridWidth) / 2 + gap;
    const startY = (svgHeight - gridHeight) / 2 + gap;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        initialDots.push({
          x: startX + col * gap * 2,
          y: startY + row * gap * 2,
          velocityX: (Math.random() * 2 - 1) * baseSpeed,
          velocityY: (Math.random() * 2 - 1) * baseSpeed,
          radius: dotRadius,
          hasNeighbors: false,
        });
      }
    }

    setDots(initialDots);

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [rows, columns, svgWidth, svgHeight]);

  // Calculate distance between two dots
  const calculateDistance = (dot1: Dot, dot2: Dot) => {
    return Math.sqrt(
      Math.pow(dot1.x - dot2.x, 2) + Math.pow(dot1.y - dot2.y, 2),
    );
  };

  // Update connections between dots
  const updateConnections = (updatedDots: Dot[]) => {
    const newConnections: Connection[] = [];
    const neighborshipMap = new Array(updatedDots.length).fill(false);

    // Check each pair of dots
    for (let i = 0; i < updatedDots.length; i++) {
      for (let j = i + 1; j < updatedDots.length; j++) {
        const distance = calculateDistance(updatedDots[i], updatedDots[j]);

        // If dots are within the connection distance
        if (distance < PROXIMITY_THRESHOLD) {
          newConnections.push({
            x1: updatedDots[i].x,
            y1: updatedDots[i].y,
            x2: updatedDots[j].x,
            y2: updatedDots[j].y,
          });

          // Mark both dots as having neighbors
          neighborshipMap[i] = true;
          neighborshipMap[j] = true;
        }
      }
    }

    // Update dots with neighbor information
    const dotsWithNeighborInfo = updatedDots.map((dot, index) => ({
      ...dot,
      hasNeighbors: neighborshipMap[index],
    }));

    setConnections(newConnections);
    return dotsWithNeighborInfo;
  };

  // Animation loop
  useEffect(() => {
    if (dots.length === 0) return;

    const animateDots = () => {
      setDots((prevDots) => {
        // First update positions and handle bounce
        const positionUpdatedDots = prevDots.map((dot) => {
          let { x, y, velocityX, velocityY } = dot;
          const { radius, hasNeighbors } = dot;

          // Update position
          x += velocityX;
          y += velocityY;

          // Bounce off edges
          if (x - radius <= 0 || x + radius >= svgWidth) {
            velocityX = -velocityX;
            x = x - radius <= 0 ? radius : svgWidth - radius;
          }

          if (y - radius <= 0 || y + radius >= svgHeight) {
            velocityY = -velocityY;
            y = y - radius <= 0 ? radius : svgHeight - radius;
          }

          return { x, y, velocityX, velocityY, radius, hasNeighbors };
        });

        // Then update connections and neighbor status
        return updateConnections(positionUpdatedDots);
      });

      animationFrameId.current = requestAnimationFrame(animateDots);
    };

    animationFrameId.current = requestAnimationFrame(animateDots);

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [svgWidth, svgHeight, PROXIMITY_THRESHOLD]);

  return (
    <>
      {/* Draw the connections between dots */}
      {connections.map((connection, index) => (
        <line
          key={`connection-${index}`}
          x1={connection.x1}
          y1={connection.y1}
          x2={connection.x2}
          y2={connection.y2}
          stroke="#999"
          strokeWidth="1"
          strokeOpacity="0.6"
        />
      ))}

      {/* Draw the dots */}
      {dots.map((dot, index) => (
        <circle
          key={`dot-${index}`}
          cx={dot.x}
          cy={dot.y}
          r={dot.radius}
          fill={dot.hasNeighbors ? "#0070f3" : "#ff4040"}
        />
      ))}
    </>
  );
};

export default BouncingDots;
