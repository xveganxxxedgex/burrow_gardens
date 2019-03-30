import React from 'react';

import BackgroundCell from 'components/Backgrounds/BackgroundCell';
import grassImage from 'images/scenery/grass.png';

const Grass = (props) => {
  return (
    <BackgroundCell {...props}>
      <img src={grassImage} alt="Grass Background" />
    </BackgroundCell>
  );
};

export default Grass;
