import React, { Component } from 'react';

import FoodItem from 'components/Food/FoodItem';
import broccoliImage from 'images/broccoli.png';

class Broccoli extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <FoodItem {...this.props}>
        <img src={broccoliImage} />
      </FoodItem>
    )
  }
}

export default Broccoli;
