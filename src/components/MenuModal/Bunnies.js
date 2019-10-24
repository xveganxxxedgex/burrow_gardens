import React from 'react';
import PropTypes from 'prop-types';
import { Glyphicon } from 'react-bootstrap';
import _orderBy from 'lodash/orderBy';

const Bunnies = ({ bunnies }) => {
  const bunnyElements = _orderBy(bunnies, ['hasCollected', 'name'], ['desc', 'asc']).map((bunny) => {
    return (
      <div key={`bunny_${bunny.name}`} className={`inventory-item-cell grid-cell ${bunny.hasCollected ? '' : 'disabled'}`}>
        <div className="inventory-item-cell-content flex flex-grow">
          {bunny.hasCollected && (
            <div className="flex flex-grow flex-column">
              <div className="inventory-item-cell-image flex flex-grow bunny-image-wrapper">
                <img src={bunny.bunnyImages.closeup} alt={bunny.name} className="bunny-close-up" />
              </div>
              <div className="inventory-item-cell-details">
                {bunny.name}
              </div>
            </div>
          )}
          {!bunny.hasCollected && (
            <div className="unlock-icon flex flex-grow">
              <Glyphicon glyph="question-sign" />
            </div>
          )}
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-column collected-section bunnies-inventory">
      <div className="h3 flex">Friends</div>
      <div className="inventory-list flex-grid grid-fifth flex-wrap">
        {bunnyElements}
      </div>
    </div>
  );
};

export default Bunnies;

Bunnies.propTypes = {
  bunnies: PropTypes.array,
};

Bunnies.defaultProps = {
  bunnies: [],
};
