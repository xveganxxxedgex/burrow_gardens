import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';
import _capitalize from 'lodash/capitalize';

import 'less/Characters.less';

@branch({
  tile: ['tile']
})
class Bunny extends Component {
  constructor(props, context) {
    super(props, context);

    this.toggleTransition = this.toggleTransition.bind(this);
    this.getBunnyImage = this.getBunnyImage.bind(this);

    this.state = {
      moveTransition: true
    };
  }

  componentWillReceiveProps(nextProps) {
    // Tile is changing - temporarily disable movement transition
    // This will prevent the hero from appearing to slide across the tile to the new starting position
    if (nextProps.tile != this.props.tile) {
      clearTimeout(this.transitionTimeout);
      this.transitionTimeout = null;
      this.toggleTransition(false);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Add back the transition once the tile has been rendered
    if (!this.state.moveTransition && !this.transitionTimeout) {
      this.transitionTimeout = setTimeout(this.toggleTransition.bind(this, true), 100);
    }
  }

  toggleTransition(moveTransition) {
    this.setState({ moveTransition });
  }

  getPosNumber(pos) {
    return Number(pos.replace('px', ''));
  }

  getBunnyImage() {
    const { isMoving, direction, isFlopped, isLoaf, bunnyImages } = this.props;
    let imageKey = 'left';

    if (isFlopped || isLoaf) {
      imageKey = isFlopped ? 'flop' : 'loaf';

      if (['up', 'down'].indexOf(direction) > -1) {
        imageKey = imageKey + _capitalize(direction);
      }
    } else {
      if (['up', 'down'].indexOf(direction) > -1) {
        imageKey = direction;
      }

      if (this.props.isMoving) {
        imageKey = imageKey + 'Gif';
      }
    }

    return bunnyImages[imageKey];
  }

  render() {
    const { name, style, children, direction, isFlopped } = this.props;
    const { moveTransition } = this.state;
    const bunnyImage = this.getBunnyImage();
    return (
      <div
        className={`bunny ${name} ${moveTransition ? '' : 'no-transition'} ${direction} ${isFlopped ? 'isFlopped' : ''}`}
        style={style || {}}
      >
        <img src={bunnyImage} />
        {children}
      </div>
    );
  }
}

export default Bunny;
