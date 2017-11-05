import React, { Component } from 'react';

class Bunny extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { name, style, children } = this.props;
    return (
      <div
        className={`bunny ${name}`}
        style={style || {}}
      >
        {children}
      </div>
    );
  }
}

export default Bunny;
