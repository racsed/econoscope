'use client';

import { useRef, useState, useEffect } from 'react';
import { interpolatePath } from 'd3-interpolate-path';

interface UseAnimatedPathOptions {
  duration?: number;
  easing?: (t: number) => number;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useAnimatedPath(
  targetPath: string,
  options: UseAnimatedPathOptions = {}
): string {
  const { duration = 400, easing = easeOutCubic } = options;
  const [currentPath, setCurrentPath] = useState(targetPath);
  const prevPathRef = useRef(targetPath);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const prevPath = prevPathRef.current;
    prevPathRef.current = targetPath;

    if (prevPath === targetPath) return;

    cancelAnimationFrame(animationRef.current);

    const interpolator = interpolatePath(prevPath, targetPath);
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);

      setCurrentPath(interpolator(easedProgress));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [targetPath, duration, easing]);

  return currentPath;
}
