import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';
import { Modal, Grid, Row, Col, Thumbnail, Label, Glyphicon } from 'react-bootstrap';
import _orderBy from 'lodash/orderBy';

import { getFoodItem } from 'actions';

import 'less/InventoryModal.less';

@branch({
  collectedFood: ['hero', 'collectedFood'],
  collectedBunnies: ['hero', 'collectedBunnies']
})
class InventoryModal extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { collectedFood, collectedBunnies, container } = this.props;
    const foodItems = _orderBy(collectedFood, ['hasCollected', 'name'], ['desc', 'asc']).map((food, index) => {
      const FoodItem = getFoodItem('Carrot');
      return (
        <div key={`food_${index}`} className={`inventory-item-cell grid-cell ${food.hasCollected ? '' : 'disabled'}`}>
          <div className="inventory-item-cell-content flex flex-grow">
            {food.hasCollected &&
              <div className="flex flex-grow flex-column">
                <div className="inventory-item-cell-image flex">
                  <FoodItem inMenu={true} item={{ type: 'Carrot', id: index }} />
                  <Label bsStyle={food.count ? 'primary' : 'default'} className="inventory-item-stock">
                    {food.count}
                  </Label>
                </div>
                <div className="inventory-item-cell-details">
                  {food.name}
                </div>
              </div>
            }
            {!food.hasCollected &&
              <div className="unlock-icon flex flex-grow">
                <Glyphicon glyph="question-sign" />
              </div>
            }
          </div>
        </div>
      )
    });
    const bunnies = collectedBunnies.map((bunny, index) => {
      // TODO: use actual bunny images
      return (
        <div key={`bunny_${index}`} className={`inventory-item-cell grid-cell ${bunny.hasCollected ? '' : 'disabled'}`}>
          <div className="inventory-item-cell-content flex flex-grow">
            {bunny.hasCollected &&
              <div className="flex flex-grow flex-column">
                <div className="inventory-item-cell-image flex">
                  <img />
                </div>
                <div className="inventory-item-cell-details">
                  {bunny.name}
                </div>
              </div>
            }
            {!bunny.hasCollected &&
              <div className="unlock-icon flex flex-grow">
                <Glyphicon glyph="question-sign" />
              </div>
            }
          </div>
        </div>
      )
    });

    return (
      <Modal
        className="inventory-modal"
        show={true}
        container={container}
      >
        <Modal.Header>Inventory</Modal.Header>
        <Modal.Body>
          <div className="flex inventory-modal-content">
            <div className="flex flex-column collected-section food-inventory">
              <div className="h3 flex">Collected Food</div>
              <div className="inventory-list flex-grid grid-third flex-wrap">
                {foodItems}
              </div>
            </div>
            <div className="flex flex-column collected-section bunnies-inventory">
              <div className="h3 flex">Friends</div>
              <div className="inventory-list flex-grid grid-third flex-wrap">
                {bunnies}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default InventoryModal;
