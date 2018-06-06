import React, { Component } from 'react';

import BackgroundCell from 'components/Backgrounds/BackgroundCell';
import image from 'images/scenery/dirt2.png';

class Dirt extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <BackgroundCell {...this.props}>
        <img src={image} />
      </BackgroundCell>
    )
  }
}

export default Dirt;
