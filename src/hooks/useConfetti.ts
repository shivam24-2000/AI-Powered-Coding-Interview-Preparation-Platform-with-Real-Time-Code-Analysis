import confetti from 'canvas-confetti';

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

/**
 * Fires a dramatic multi-burst confetti celebration.
 * Call `fire()` whenever the user solves a problem successfully.
 */
export function useConfetti() {
  const fire = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    // Initial big center pop
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { x: 0.5, y: 0.55 },
      colors: ['#a855f7', '#6366f1', '#38bdf8', '#f472b6', '#34d399', '#fbbf24'],
      zIndex: 9999,
      scalar: 1.2,
    });

    // Side cannons
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ['#a855f7', '#6366f1', '#f472b6'],
        zIndex: 9999,
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ['#38bdf8', '#34d399', '#fbbf24'],
        zIndex: 9999,
      });
    }, 150);

    // Sparkle rain loop
    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 3,
        angle: randomInRange(55, 125),
        spread: randomInRange(50, 70),
        origin: { x: randomInRange(0.2, 0.8), y: Math.random() - 0.2 },
        colors: ['#a855f7', '#6366f1', '#38bdf8', '#f472b6', '#34d399'],
        zIndex: 9999,
        gravity: 1.2,
        drift: randomInRange(-0.2, 0.2),
        scalar: randomInRange(0.8, 1.3),
      });

      requestAnimationFrame(frame);
    };

    setTimeout(() => requestAnimationFrame(frame), 300);
  };

  return { fire };
}
