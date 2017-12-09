import React, { Component } from 'react';

import 'less/Food.less';

class FoodItem extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {
      type,
      position,
      collected,
      id,
      height,
      width,
      image,
      index,
      children,
      inMenu
    } = this.props;
    const style = {
      height: height + 'px',
      width: width + 'px'
    };

    if (!inMenu) {
      style.top = position.y + 'px';
      style.left = position.x + 'px';
    }

    if (!inMenu && collected) {
      return <span />;
    }

    return (
      <div
        className={`food ${type} food_index_${id}`}
        style={style}
      >
        <img src={image} />
      </div>
    )
  }
}

export default FoodItem;
