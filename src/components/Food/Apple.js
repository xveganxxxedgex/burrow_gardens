import React, { Component } from 'react';

import FoodItem from 'components/Food/FoodItem';
import image from 'images/apple1.png';

class Apple extends Component {
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

export default Apple;
