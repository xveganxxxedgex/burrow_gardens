import React, { Component } from 'react';

import 'less/Scenery.less';

class SceneryItem extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {
      position: { x, y },
      sceneryClass,
      height,
      width,
      image,
      index
    } = this.props;
    const style = {
      top: y + 'px',
      left: x + 'px',
      height: height + 'px',
      width: width + 'px'
    };

    return (
      <div
        className={`scenery ${sceneryClass || ''} scenery_index_${index}`}
        style={style}
      >
        <img src={image} />
      </div>
    )
  }
}

export default SceneryItem;
