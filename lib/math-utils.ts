/**
 * Interpolation lineaire entre a et b selon le facteur t (0..1).
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Restreint une valeur entre min et max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Arrondit un nombre à un nombre donne de decimales.
 */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Représentation d'une equation lineaire y = slope * x + intercept.
 */
interface LinearEquation {
  slope: number;
  intercept: number;
}

/**
 * Trouve le point d'intersection de deux equations lineaires.
 * Retourne null si les droites sont paralleles.
 */
export function solveLinearEquilibrium(
  eq1: LinearEquation,
  eq2: LinearEquation,
): { x: number; y: number } | null {
  const denominator = eq1.slope - eq2.slope;

  if (Math.abs(denominator) < 1e-10) {
    return null;
  }

  const x = (eq2.intercept - eq1.intercept) / denominator;
  const y = eq1.slope * x + eq1.intercept;

  return { x, y };
}

/**
 * Calcule l'aire sous une courbe par integration trapezoidale.
 * Les points doivent etre tries par x croissant.
 */
export function computeArea(
  points: ReadonlyArray<{ x: number; y: number }>,
): number {
  if (points.length < 2) return 0;

  let area = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const avgY = (points[i].y + points[i - 1].y) / 2;
    area += dx * avgY;
  }

  return area;
}

/**
 * Echantillonne une fonction sur un intervalle [start, end]
 * et retourne un tableau de points { x, y }.
 */
export function generateCurvePoints(
  fn: (x: number) => number,
  start: number,
  end: number,
  steps: number = 100,
): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  const step = (end - start) / steps;

  for (let i = 0; i <= steps; i++) {
    const x = start + i * step;
    points.push({ x, y: fn(x) });
  }

  return points;
}
