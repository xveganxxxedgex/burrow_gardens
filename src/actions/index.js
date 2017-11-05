import tree from 'state';
let tooltipTimeout;

export function updateHeroPosition(newPos) {
  const cursor = tree.select('heroPosition');
  cursor.set(newPos);
}

export function setTooltip(text, duration = 3000) {
  const cursor = tree.select('tooltip');
  cursor.set(text);
  tree.commit();

  if (text) {
    tooltipTimeout = setTimeout(() => {
      setTooltip(null);
    }, duration);
  } else {
    clearTimeout(tooltipTimeout);
  }
}
