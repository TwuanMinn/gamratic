import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  inView: boolean;
  suffix?: string;
  decimals?: number;
}

export default function AnimatedCounter({
  target,
  duration = 1800,
  suffix = '',
  decimals = 0,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target <= 0) return;

    let animationId: number;
    const startTime = performance.now();
    const endTarget = target;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * endTarget);

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      } else {
        setCount(endTarget);
      }
    };

    // Small delay to allow the parent's scroll-reveal fade-in to start
    const timer = setTimeout(() => {
      animationId = requestAnimationFrame(animate);
    }, 200);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationId);
    };
  }, [target, duration]);

  const display = decimals > 0 ? count.toFixed(decimals) : Math.round(count);

  return (
    <span>{display}{suffix}</span>
  );
}
