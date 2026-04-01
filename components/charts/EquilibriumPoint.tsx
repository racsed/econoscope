'use client';

import { motion } from 'framer-motion';
import { useAnimatedValue } from '@/hooks/useAnimatedScale';

interface EquilibriumPointProps {
  cx: number;
  cy: number;
  color?: string;
  size?: number;
  label?: string;
  labelOffset?: { x: number; y: number };
}

export function EquilibriumPoint({
  cx,
  cy,
  color = '#6366F1',
  size = 6,
  label,
  labelOffset = { x: 10, y: -10 },
}: EquilibriumPointProps) {
  const animCx = useAnimatedValue(cx, 400);
  const animCy = useAnimatedValue(cy, 400);

  return (
    <g>
      {/* Pulse ring */}
      <motion.circle
        cx={animCx}
        cy={animCy}
        r={size}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        initial={{ r: size, opacity: 0.8 }}
        animate={{
          r: [size, size * 2.5, size],
          opacity: [0.8, 0, 0.8],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Core dot */}
      <motion.circle
        cx={animCx}
        cy={animCy}
        r={size}
        fill={color}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
      {/* Inner bright dot */}
      <circle cx={animCx} cy={animCy} r={size * 0.4} fill="white" opacity={0.6} />
      {/* Label */}
      {label && (
        <motion.text
          x={animCx + labelOffset.x}
          y={animCy + labelOffset.y}
          fill={color}
          fontSize={12}
          fontFamily="var(--font-mono)"
          fontWeight={500}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {label}
        </motion.text>
      )}
    </g>
  );
}

export default EquilibriumPoint;
