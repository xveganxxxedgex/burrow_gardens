import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';
import { Modal, Label, Glyphicon, Tabs, Tab } from 'react-bootstrap';
import _orderBy from 'lodash/orderBy';

import FoodItem from 'components/Food/FoodItem';
import * as Food from 'components/Food';

import { changeMenuTab } from 'actions';

import 'less/MenuModal.less';

class MenuModal extends Component {
  constructor(props, context) {
    super(props, context);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.show != this.props.show;
  }

  render() {
    const { container } = this.props;

    return (
      <Modal
        className="menu-modal"
        show={true}
        container={container}
      >
        <Modal.Header>Game Menu</Modal.Header>
        <Modal.Body>
          <MenuTabs />
        </Modal.Body>
      </Modal>
    );
  }
}

export default MenuModal;

@branch({
  produceList: ['produceList'],
  bunnies: ['bunnies'],
  wonGame: ['wonGame'],
  activeTab: ['activeMenuTab']
})
class MenuTabs extends Component {
  getWonGameContent() {
    return (
      <div className="main-menu-content">
        <div className="h3">Congratulations!</div>
        <br/>
        <p>
          You collected all the possible produce and befriended all the bunnies!
        </p>
      </div>
    )
  }

  getWelcomeContent() {
    return (
      <div className="main-menu-content">
        <div className="h3">Welcome to Burrow Gardens!</div>
        <p>
          As the newest bunny in Burrow Gardens, your mission is to discover
          all of the produce in the area, and to get all bunny residents
          to become your friend.
        </p>
        <p>
          Some bunnies will teach you new skills that
          will gain you access to new areas, enable to you collect certain
          produce, and even win over some less-friendly bunnies.
        </p>
        <br/>
        <div className="h3">Controls</div>
        <h5>
          Use your <Label>keyboard controls</Label> or <Label>WASD</Label> to
          move, <Label>space</Label> for action,
          and <Label>i</Label> to open or close this menu.
        </h5>
      </div>
    )
  }

  render() {
    const { produceList, bunnies, wonGame, activeTab } = this.props;

    return (
      <div className="flex menu-modal-content">
        <Tabs activeKey={activeTab} onSelect={changeMenuTab} className="tabs" id="menu-tabs">
          <Tab eventKey={1} title="Main Menu">
            {wonGame ? this.getWonGameContent() : this.getWelcomeContent()}
          </Tab>
          <Tab eventKey={2} title="Collected Food">
            <FoodList produceList={produceList} />
          </Tab>
          <Tab eventKey={3} title="Friends">
            <BunnyList bunnies={bunnies} />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

class FoodList extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { produceList } = this.props;
    const foodItems = _orderBy(produceList, ['hasCollected', 'name'], ['desc', 'asc']).map((food, index) => {
      // TODO: Remove this once all food items have files
      const availableFood = ['AlfalfaHay', 'Apple', 'Arugula', 'Banana', 'Blueberry', 'BokChoy', 'Broccoli', 'ButterLettuce', 'Cabbage', 'Carrot', 'Cilantro', 'DandelionGreens', 'Endive', 'Melon', 'Mint'];
      const useFoodType = availableFood.indexOf(food.name) > -1 ? food.name : 'Carrot';
      const foodObj = new Food[useFoodType]({}, index);
      return (
        <div key={`food_${index}`} className={`inventory-item-cell grid-cell ${food.hasCollected ? '' : 'disabled'}`}>
          <div className="inventory-item-cell-content flex flex-grow">
            {food.hasCollected &&
              <div className="flex flex-grow flex-column">
                <div className="inventory-item-cell-image flex flex-grow">
                  <FoodItem {...foodObj} inMenu type={useFoodType} />
                  <Label bsStyle={food.count ? 'primary' : 'default'} className="inventory-item-stock">
                    {food.count}
                  </Label>
                </div>
                <div className="inventory-item-cell-details">
                  {food.display}
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

    return (
      <div className="flex flex-column collected-section food-inventory">
        <div className="h3 flex">Collected Food</div>
        <div className="inventory-list flex-grid grid-fifth flex-wrap">
          {foodItems}
        </div>
      </div>
    );
  }
}

class BunnyList extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { bunnies } = this.props;
    const bunnyElements = bunnies.map((bunny, index) => {
      // TODO: use actual bunny images
      return (
        <div key={`bunny_${index}`} className={`inventory-item-cell grid-cell ${bunny.hasCollected ? '' : 'disabled'}`}>
          <div className="inventory-item-cell-content flex flex-grow">
            {bunny.hasCollected &&
              <div className="flex flex-grow flex-column">
                <div className="inventory-item-cell-image flex flex-grow bunny-image-wrapper">
                  <img src={bunny.bunnyImages.closeup} className="bunny-close-up"/>
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
      <div className="flex flex-column collected-section bunnies-inventory">
        <div className="h3 flex">Friends</div>
        <div className="inventory-list flex-grid grid-fifth flex-wrap">
          {bunnyElements}
        </div>
      </div>
    );
  }
}
