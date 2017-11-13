import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';
import { Modal } from 'react-bootstrap';

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
    const foodItems = collectedFood.map((food, index) => {
      const FoodItem = getFoodItem('Carrot');
      return (
        <div key={`food_${index}`}>
          <FoodItem inMenu={true} item={{ type: 'Carrot', id: index }} />
          {food.name} : {food.count}
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
          <div>
            {foodItems}
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default InventoryModal;
