import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';

import MenuTabs from 'components/MenuModal/MenuTabs';

import 'less/MenuModal.less';

class MenuModal extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.show !== this.props.show;
  }

  render() {
    const { container } = this.props;

    return (
      <Modal
        className="menu-modal"
        show
        container={container}
      >
        <Modal.Header>Game Menu</Modal.Header>
        <Modal.Body>
          <MenuTabs />
        </Modal.Body>
      </Modal>
    );
  }
}

export default MenuModal;

MenuModal.propTypes = {
  container: PropTypes.object.isRequired,
  show: PropTypes.bool,
};

MenuModal.defaultProps = {
  show: false,
};
