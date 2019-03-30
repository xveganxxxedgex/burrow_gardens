import React from 'react';

import BackgroundCell from 'components/Backgrounds/BackgroundCell';
import grassImage from 'images/scenery/grass2.png';

const Grass2 = (props) => {
  return (
    <BackgroundCell {...props}>
      <img src={grassImage} alt="Grass 2 Background" />
    </BackgroundCell>
  );
};

export default Grass2;
