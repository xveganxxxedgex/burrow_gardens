import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { branch } from 'baobab-react/higher-order';

import 'less/Backgrounds.less';

@branch({
  backgrounds: ['backgrounds'],
})
class BackgroundCell extends Component {
  render() {
    const {
      tile,
      index,
      children,
      backgrounds,
    } = this.props;
    const backgroundClass = backgrounds[tile];

    return (
      <div className={`background-tile ${backgroundClass}`} key={`tile-${index}`}>
        {children}
      </div>
    );
  }
}

export default BackgroundCell;

BackgroundCell.propTypes = {
  tile: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
    PropTypes.node,
  ]),
  backgrounds: PropTypes.object,
};

BackgroundCell.defaultProps = {
  backgrounds: {},
  children: null,
};
