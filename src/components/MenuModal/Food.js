import React from 'react';
import PropTypes from 'prop-types';
import { Label, Glyphicon } from 'react-bootstrap';
import _orderBy from 'lodash/orderBy';

import FoodItem from 'components/Food/FoodItem';
import * as Food from 'components/Food';

const FoodList = ({ produceList }) => {
  const foodItems = _orderBy(produceList, ['hasCollected', 'name'], ['desc', 'asc']).map((food, index) => {
    const foodObj = new Food[food.name]({ position: {}, id: index });
    return (
      <div key={`food_${foodObj.id}`} className={`inventory-item-cell grid-cell ${food.hasCollected ? '' : 'disabled'}`}>
        <div className="inventory-item-cell-content flex flex-grow">
          {food.hasCollected && (
            <div className="flex flex-grow flex-column">
              <div className="inventory-item-cell-image flex flex-grow">
                <FoodItem {...foodObj} inMenu type={food.name} />
                <Label bsStyle={food.count ? 'primary' : 'default'} className="inventory-item-stock">
                  {food.count}
                </Label>
              </div>
              <div className="inventory-item-cell-details">
                {food.display}
              </div>
            </div>
          )}
          {!food.hasCollected && (
            <div className="unlock-icon flex flex-grow">
              <Glyphicon glyph="question-sign" />
            </div>
          )}
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-column collected-section food-inventory">
      <div className="h3 flex">Collected Food</div>
      <div className="inventory-list flex-grid grid-fifth flex-wrap">
        {foodItems}
      </div>
    </div>
  );
};

export default FoodList;

FoodList.propTypes = {
  produceList: PropTypes.array,
};

FoodList.defaultProps = {
  produceList: [],
};
