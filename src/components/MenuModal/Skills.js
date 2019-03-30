import React from 'react';
import PropTypes from 'prop-types';
import { Glyphicon } from 'react-bootstrap';
import _capitalize from 'lodash/capitalize';
import _find from 'lodash/find';
import _orderBy from 'lodash/orderBy';

const Skills = ({ allSkills, heroSkills }) => {
  const hasSkill = skill => !!_find(heroSkills, ability => ability === skill.name);
  const skillElements = _orderBy(allSkills, [hasSkill, 'name'], ['desc', 'asc']).map((skill) => {
    const heroHasSkill = hasSkill(skill);
    return (
      <div key={`skill_${skill.name}`} className={`inventory-item-cell skill-chunk grid-cell ${heroHasSkill ? '' : 'disabled'}`}>
        <div className="inventory-item-cell-content flex flex-grow">
          {heroHasSkill && (
            <div>
              <div className="h4">{_capitalize(skill.name)}</div>
              <p>{skill.description}</p>
            </div>
          )}
          {!heroHasSkill && (
            <div className="unlock-icon flex flex-grow">
              <Glyphicon glyph="question-sign" />
            </div>
          )}
        </div>
      </div>
    );
  });
  return (
    <div className="flex flex-column collected-section skills-inventory">
      <div className="h3 flex">Skills</div>
      <div className="inventory-list flex-grid grid-full flex-wrap">
        {skillElements}
      </div>
    </div>
  );
};

export default Skills;

Skills.propTypes = {
  allSkills: PropTypes.array,
  heroSkills: PropTypes.array,
};

Skills.defaultProps = {
  allSkills: [],
  heroSkills: [],
};
