import React, { Component } from 'react';

import SceneryItem from 'components/Scenery/SceneryItem';
import bushImage from 'images/Brick3.png';

class Bush extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <SceneryItem {...this.props}>
        <img src={bushImage} />
      </SceneryItem>
    )
  }
}

export default Bush;
