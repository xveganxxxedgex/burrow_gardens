import React, { Component } from 'react';

import 'less/Food.less';

class FoodItem extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {
      item: {
        type,
        position: { x, y }
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
        className={`food ${type} food_index_${index}`}
        style={style}
      >
        {children}
      </div>
    )
  }
}

export default FoodItem;
