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
        position: { x, y },
        collected,
        id
      },
      index,
      children
    } = this.props;
    const style = {
      top: y + 'px',
      left: x + 'px'
    };

    if (collected) {
      return <span />;
    }

    return (
      <div
        className={`food ${type} food_index_${id}`}
        style={style}
      >
        {children}
      </div>
    )
  }
}

export default FoodItem;
