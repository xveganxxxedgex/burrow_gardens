import React from 'react';

import BackgroundCell from 'components/Backgrounds/BackgroundCell';
import image from 'images/scenery/dirt2.png';

const Dirt = (props) => {
  return (
    <BackgroundCell {...props}>
      <img src={image} alt="Dirt Background" />
    </BackgroundCell>
  );
};

export default Dirt;
