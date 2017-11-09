import React, { Component } from 'react';

import FoodItem from 'components/Food/FoodItem';
import carrotImage from 'images/carrot1.png';

class Carrot extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <FoodItem {...this.props}>
        <img src={carrotImage} />
      </FoodItem>
    )
  }
}

export default Carrot;
