import React, { Component } from 'react';
import { branch } from 'baobab-react/higher-order';

import 'less/Backgrounds.less';

@branch({
  backgrounds: ['backgrounds']
})
class BackgroundCell extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const {
      tile,
      index,
      children,
      backgrounds
    } = this.props;
    const backgroundClass = backgrounds[tile];

    return (
      <div className={`background-tile ${backgroundClass}`} key={`tile-${index}`}>
        {children}
      </div>
    )
  }
}

export default BackgroundCell;
