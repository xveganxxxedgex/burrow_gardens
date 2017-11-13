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
        position,
        collected,
        id
      },
      index,
      children,
      inMenu
    } = this.props;
    const style = !inMenu ? {
      top: position.y + 'px',
      left: position.x + 'px'
    } : null;

    if (!inMenu && collected) {
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
