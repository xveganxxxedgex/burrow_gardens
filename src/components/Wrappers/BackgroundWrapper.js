import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';
import _isEqual from 'lodash/isEqual';

import { getBackgroundCell } from 'actions';

@branch({
  tile: ['tile'],
})
export default class BackgroundWrapper extends Component {
  shouldComponentUpdate(nextProps) {
    return !_isEqual([nextProps.tile.x, nextProps.tile.y], [this.props.tile.x, this.props.tile.y]);
  }

  render() {
    const { tile } = this.props;

    return (
      <div className="background-wrapper">
        {tile.background.map((row, rowIndex) => {
          return (
            <div className="background-row" key={`row-${rowIndex}`}>
              {row.map((tile, tileIndex) => {
                const BackgroundItem = getBackgroundCell(tile);
                return (
                  <BackgroundItem tile={tile} key={`background-${tileIndex}`} index={tileIndex} />
                );
              })}
            </div>
          );
        })}
      </div>
    )
  }
}