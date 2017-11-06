import React, { Component } from 'react';

import 'less/Scenery.less';

class Scenery extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { type, position: { x, y } } = this.props.item;
    const style = {
      top: y + 'px',
      left: x + 'px'
    };

    return (
      <div
        className={`scenery ${type}`}
        style={style}
      />
    )
  }
}

export default Scenery;
