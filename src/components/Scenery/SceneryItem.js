import React, { Component } from 'react';

import 'less/Scenery.less';

class SceneryItem extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {
      item: {
        type,
        position: { x, y },
        sceneryClass
      },
      index,
      children
    } = this.props;
    const style = {
      top: y + 'px',
      left: x + 'px'
    };

    return (
      <div
        className={`scenery ${type} ${sceneryClass || ''} scenery_index_${index}`}
        style={style}
      >
        {children}
      </div>
    )
  }
}

export default SceneryItem;
