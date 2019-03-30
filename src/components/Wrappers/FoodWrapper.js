import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { branch } from 'baobab-react/higher-order';
import _isEqual from 'lodash/isEqual';

import FoodItem from 'components/Food/FoodItem';

@branch({
  tile: ['tile'],
  foodOnTile: ['foodOnTile'],
})
class FoodWrapper extends Component {
  shouldComponentUpdate(nextProps) {
    const tileChanged = !_isEqual(
      [nextProps.tile.x, nextProps.tile.y],
      [this.props.tile.x, this.props.tile.y],
    );
    const foodChanged = !_isEqual(nextProps.foodOnTile, this.props.foodOnTile);
    return tileChanged || foodChanged;
  }

  render() {
    const { foodOnTile } = this.props;

    return (
      <div className="food-wrapper">
        {foodOnTile.map((item) => {
          return (
            <FoodItem {...item} key={`food-${item.id}`} />
          );
        })}
      </div>
    );
  }
}

export default FoodWrapper;

FoodWrapper.propTypes = {
  foodOnTile: PropTypes.array,
  tile: PropTypes.object,
};

FoodWrapper.defaultProps = {
  foodOnTile: [],
  tile: {},
};
