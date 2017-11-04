import tree from 'state';

export function updateHeroPosition(newPos) {
  const cursor = tree.select('heroPosition');
  cursor.set(newPos);
}
