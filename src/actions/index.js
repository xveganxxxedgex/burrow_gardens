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

function assignDimensionProperties(dimensions, properties) {
  properties = properties || [
    'top',
    'bottom',
    'left',
    'right',
    'height',
    'width'
  ];
  const newDimensions = {};

  properties.map(property => {
    newDimensions[property] = dimensions[property];
  });

  return newDimensions;
}

export function setBoardDimensions(board) {
  const boardRect = board.getBoundingClientRect();
  const newDimensions = assignDimensionProperties(boardRect);

  const cursor = tree.select('boardDimensions');
  cursor.set(newDimensions);
}
