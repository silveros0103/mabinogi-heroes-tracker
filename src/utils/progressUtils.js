export function calculateProgressPercent(tasks) {
  let total = 0;
  let completed = 0;

  ["daily", "weekly", "monthly"].forEach((type) => {
    if (tasks[type]) {
      const entries = Object.entries(tasks[type]);
      total += entries.length;
      completed += entries.filter(([_, done]) => done).length;
    }
  });

  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

export function calculateAverageProgress(allProgress) {
  const characters = Object.values(allProgress);
  if (characters.length === 0) return 0;

  const totalPercent = characters.reduce((sum, char) => {
    return sum + calculateProgressPercent(char);
  }, 0);

  return Math.round(totalPercent / characters.length);
}
