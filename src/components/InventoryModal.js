import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';
import { Modal } from 'react-bootstrap';

// import 'less/InventoryModal.less';

@branch({
  collectedFood: ['hero', 'collectedFood'],
  collectedBunnies: ['hero', 'collectedBunnies']
})
class InventoryModal extends Component {
  constructor(props, context) {
    super(props, context);

    this.getBoardBounds = this.getBoardBounds.bind(this);
  }

  componentWillMount() {
    setActiveTile();
  }

  componentDidMount() {
    window.addEventListener('resize', this.getBoardBounds);

    this.getBoardBounds();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.getBoardBounds);
  }

  getBoardBounds() {
    setTimeout(() => {
      setBoardDimensions(this.board);
    }, 1);
  }

  render() {
    const { collectedFood, collectedBunnies } = this.props;

    return (
      <Modal className="inventory-modal">
        <Modal.Header>Inventory</Modal.Header>
        <Modal.Body>
          
        </Modal.Body>
      </Modal>
    );
  }
}

export default InventoryModal;
