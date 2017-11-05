import tree from 'state';

export function updateHeroPosition(newPos) {
  const cursor = tree.select('heroPosition');
  cursor.set(newPos);
}

export function setTooltip(text, duration = 3000) {
  const cursor = tree.select('tooltip');
  cursor.set(text);

  if (text) {
    setTimeout(() => {
      setTooltip(null);
    }, duration);
  }
}
