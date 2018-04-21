import React, { Component } from 'react';

import BackgroundCell from 'components/Backgrounds/BackgroundCell';
import grassImage from 'images/scenery/grass.png';

class Mud extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <BackgroundCell {...this.props}>
        <img src={grassImage} />
      </BackgroundCell>
    )
  }
}

export default Mud;
