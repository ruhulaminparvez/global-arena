import { useState, useEffect } from "react";

/**
 * Counter animation hook with smooth, realistic increment
 * Animates a number from 0 to targetValue over the specified duration
 *
 * @param targetValue - The target value to animate to
 * @param duration - Animation duration in milliseconds (default: 4000ms)
 * @returns The current animated count value
 */
export function useCounterAnimation(
  targetValue: number,
  duration: number = 4000,
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const delay = 500; // Delay before starting for better UX

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;

      // Wait for delay before starting
      if (elapsed < delay) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      const adjustedElapsed = elapsed - delay;
      const progress = Math.min(adjustedElapsed / duration, 1);

      // Use easeOutExpo for very smooth, natural deceleration
      // This creates a realistic counting effect that slows down as it approaches the target
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      // Calculate the current count value
      const currentCount = targetValue * easeOutExpo;

      // Use Math.round for smoother increments (better than Math.floor for visual effect)
      setCount(Math.round(currentCount));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // Ensure we end exactly at target value
        setCount(targetValue);
      }
    };

    // Reset to 0 when target changes
    setCount(0);
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [targetValue, duration]);

  return count;
}
