import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { branch } from 'baobab-react/higher-order';
import _flatten from 'lodash/flatten';
import _isEqual from 'lodash/isEqual';
import _union from 'lodash/union';

import SceneryItem from 'components/Scenery/SceneryItem';

@branch({
  tile: ['tile'],
})
class SceneryWrapper extends Component {
  shouldComponentUpdate(nextProps) {
    const tileChanged = !_isEqual(
      [nextProps.tile.x, nextProps.tile.y],
      [this.props.tile.x, this.props.tile.y],
    );
    const sceneryChanged = !_isEqual(nextProps.tile.scenery, this.props.tile.scenery);
    return tileChanged || sceneryChanged;
  }

  render() {
    const { tile } = this.props;

    return (
      <div className="scenery-wrapper">
        {_flatten(tile.scenery.map((item, itemIndex) => {
          let itemElements = [
            <SceneryItem {...item} key={`scenery-${item.id || itemIndex}`} index={item.id || itemIndex} />,
          ];

          if (item.collisionPoints) {
            itemElements = _union(
              itemElements,
              item.collisionPoints.map((collisionItem, colIndex) => (
                <SceneryItem
                  {...collisionItem}
                  key={`scenery-collision-${collisionItem.id}_${colIndex}`} // eslint-disable-line react/no-array-index-key
                  index={collisionItem.id || colIndex}
                />
              )),
            );
          }

          return itemElements;
        }))}
      </div>
    );
  }
}

export default SceneryWrapper;

SceneryWrapper.propTypes = {
  tile: PropTypes.object,
};

SceneryWrapper.defaultProps = {
  tile: {},
};
