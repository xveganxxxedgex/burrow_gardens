import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
        {tile.background.map((row, index) => {
          const rowIndex = index;
          return (
            <div className="background-row" key={`row-${rowIndex}`}>
              {row.map((cell, cellIndex) => {
                const cellKey = cellIndex;
                const BackgroundItem = getBackgroundCell(cell);
                return (
                  <BackgroundItem tile={cell} key={`background-${cellKey}`} index={cellKey} />
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

BackgroundWrapper.propTypes = {
  tile: PropTypes.object,
};

BackgroundWrapper.defaultProps = {
  tile: {},
};
