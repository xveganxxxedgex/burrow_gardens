import React, { Component } from 'react';

import FoodItem from 'components/Food/FoodItem';
import carrotImage from 'images/groundcarrot.png';

class BuriedCarrot extends Component {
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

export default BuriedCarrot;
