import React, { Component } from 'react';

import 'less/Scenery.less';

class Scenery extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {
      item: {
        type,
        position: { x, y }
      },
      index
    } = this.props;
    const style = {
      top: y + 'px',
      left: x + 'px'
    };

    return (
      <div
        className={`scenery ${type} scenery_index_${index}`}
        style={style}
      />
    )
  }
}

export default Scenery;
