import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';

import 'less/Characters.less';

@branch({
  tile: ['tile']
})
class Bunny extends Component {
  constructor(props, context) {
    super(props, context);

    this.toggleTransition = this.toggleTransition.bind(this);

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

  render() {
    const { name, style, children, direction } = this.props;
    const { moveTransition } = this.state;
    return (
      <div
        className={`bunny ${name} ${moveTransition ? '' : 'no-transition'} ${direction}`}
        style={style || {}}
      >
        {children}
      </div>
    );
  }
}

export default Bunny;
