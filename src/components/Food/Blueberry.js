import React, { Component } from 'react';

import FoodItem from 'components/Food/FoodItem';
import image from 'images/blueberries.png';

class Blueberry extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <FoodItem {...this.props}>
        <img src={image} />
      </FoodItem>
    )
  }
}

export default Blueberry;
