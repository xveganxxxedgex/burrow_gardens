import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { branch } from 'baobab-react/higher-order';
import _isEqual from 'lodash/isEqual';

import Bunny from 'components/Characters/Bunny';

@branch({
  tile: ['tile'],
  bunniesOnTile: ['bunniesOnTile'],
})
class BunniesWrapper extends Component {
  shouldComponentUpdate(nextProps) {
    const tileChanged = !_isEqual(
      [nextProps.tile.x, nextProps.tile.y],
      [this.props.tile.x, this.props.tile.y],
    );
    const bunniesChanged = !_isEqual(nextProps.bunniesOnTile, this.props.bunniesOnTile);
    return tileChanged || bunniesChanged;
  }

  render() {
    const { bunniesOnTile } = this.props;

    return (
      <div className="bunny-wrapper">
        {bunniesOnTile.map(item => (
          <Bunny {...item} key={`bunny-${item.id}`} index={item.id} />
        ))}
      </div>
    );
  }
}

export default BunniesWrapper;

BunniesWrapper.propTypes = {
  bunniesOnTile: PropTypes.array,
  tile: PropTypes.object,
};

BunniesWrapper.defaultProps = {
  bunniesOnTile: [],
  tile: {},
};
