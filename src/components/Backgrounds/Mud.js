import React from 'react';

import BackgroundCell from 'components/Backgrounds/BackgroundCell';
// TODO: Use mud image
// import mudImage from 'images/scenery/mud.png';
import mudImage from 'images/scenery/grass.png';

const Mud = (props) => {
  return (
    <BackgroundCell {...props}>
      <img src={mudImage} alt="Mud Background" />
    </BackgroundCell>
  );
};

export default Mud;
