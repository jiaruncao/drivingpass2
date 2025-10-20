export function formatScore(score) {
  const value = Number(score);
  if (!Number.isFinite(value)) {
    return '0.0';
  }
  return value.toFixed(1);
}
