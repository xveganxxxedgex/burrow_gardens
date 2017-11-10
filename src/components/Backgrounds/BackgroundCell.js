import React, { Component } from 'react';

import 'less/Backgrounds.less';

class BackgroundCell extends Component {
  constructor(props, context) {
    super(props, context);

    this.backgrounds = {
      B0: 'dirt',
      B1: 'grass',
      B2: 'bush',
    };
  }

  render() {
    const {
      tile,
      index,
      children
    } = this.props;
    const backgroundClass = this.backgrounds[tile];

    return (
      <div className={`background-tile ${backgroundClass}`} key={`tile-${index}`}>
        {children}
      </div>
    )
  }
}

export default BackgroundCell;
