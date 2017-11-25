import React, { Component } from 'react';

import FoodItem from 'components/Food/FoodItem';
import alfalfaImage from 'images/alfalfa_hay.png';

class AlfalfaHay extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <FoodItem {...this.props}>
        <img src={alfalfaImage} />
      </FoodItem>
    )
  }
}

export default AlfalfaHay;
