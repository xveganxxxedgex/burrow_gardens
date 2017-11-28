import React, { Component } from 'react';

import FoodItem from 'components/Food/FoodItem';
import image from 'images/cabbage.png';

class Cabbage extends Component {
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

export default Cabbage;
