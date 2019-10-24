import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { branch } from 'baobab-react/higher-order';
import { Label, Tabs, Tab } from 'react-bootstrap';

import Bunnies from 'components/MenuModal/Bunnies';
import Food from 'components/MenuModal/Food';
import Settings from 'components/MenuModal/Settings';
import Skills from 'components/MenuModal/Skills';

import { changeMenuTab } from 'actions';

@branch({
  produceList: ['produceList'],
  bunnies: ['bunnies'],
  wonGame: ['wonGame'],
  activeTab: ['activeMenuTab'],
  allSkills: ['skills'],
  heroSkills: ['hero', 'abilities'],
  audioSettings: ['audioSettings'],
  allowSaving: ['allowSaving']
})
class MenuTabs extends Component {
  static getWonGameContent() {
    return (
      <div className="main-menu-content">
        <div className="h3">Congratulations!</div>
        <br />
        <p>
          You collected all the possible produce and befriended all the bunnies!
        </p>
      </div>
    );
  }

  static getWelcomeContent() {
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
        <br />
        <div className="h3">Controls</div>
        <h5>
          Use your <Label>keyboard controls</Label> or <Label>WASD</Label> to
          move, <Label>space</Label> for action,
          and <Label>i</Label> to open or close this menu.
        </h5>
      </div>
    );
  }

  render() {
    const {
      produceList,
      bunnies,
      wonGame,
      activeTab,
      allSkills,
      heroSkills,
      audioSettings,
      allowSaving,
    } = this.props;

    return (
      <div className="flex menu-modal-content">
        <Tabs activeKey={activeTab} onSelect={changeMenuTab} className="tabs" id="menu-tabs">
          <Tab eventKey={1} title="Main Menu">
            {wonGame ? MenuTabs.getWonGameContent() : MenuTabs.getWelcomeContent()}
          </Tab>
          <Tab eventKey={2} title="Collected Food">
            <Food produceList={produceList} />
          </Tab>
          <Tab eventKey={3} title="Friends">
            <Bunnies bunnies={bunnies} />
          </Tab>
          <Tab eventKey={4} title="Skills">
            <Skills allSkills={allSkills} heroSkills={heroSkills} />
          </Tab>
          <Tab eventKey={5} title="Settings">
            <Settings audioSettings={audioSettings} allowSaving={allowSaving} />
          </Tab>
        </Tabs>
      </div>
    );
  }
}

export default MenuTabs;

MenuTabs.propTypes = {
  produceList: PropTypes.array,
  bunnies: PropTypes.array,
  wonGame: PropTypes.bool,
  activeTab: PropTypes.number,
  allSkills: PropTypes.array,
  heroSkills: PropTypes.array,
  audioSettings: PropTypes.object,
};

MenuTabs.defaultProps = {
  produceList: [],
  bunnies: [],
  wonGame: false,
  activeTab: 1,
  allSkills: [],
  heroSkills: [],
  audioSettings: {},
};
