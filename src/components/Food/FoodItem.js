import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';

import { SHAKE_DURATION, FALL_DURATION } from 'components/constants';
import { getItemById } from 'actions';

import 'less/Food.less';

const getLeftPos = (left, fallToX, fallLeft, offset) => {
  return fallLeft ? left - ((left - fallToX) * offset) : left + ((fallToX - left) * offset);
};

const shakeAnimation = (top) => {
  return keyframes`
    0% {
      top: ${top}px;
    }

    50% {
      top: ${top + 5}px;
    }

    100% {
      top: ${top}px;
    }
  `;
};

const fallToAnimation = (props) => {
  const { top, left, fallLeft, fallToX, fallToY } = props;
  return keyframes`
    0% {
      top: ${top}px;
      left: ${left}px;
    }

    50% {
      top: ${fallToY}px;
      left: ${left}px;
    }

    65% {
      top: ${fallToY - (fallToY * 0.04)}px;
      left: ${getLeftPos(left, fallToX, fallLeft, 0.5)}px;
    }

    80% {
      top: ${fallToY}px;
      left: ${getLeftPos(left, fallToX, fallLeft, 0.65)}px;
    }

    90% {
      top: ${fallToY - (fallToY * 0.02)}px;
      left: ${getLeftPos(left, fallToX, fallLeft, 0.8)}px;
    }

    100% {
      top: ${fallToY}px;
      left: ${fallToX}px;
    }
  `;
};

const StyledFood = styled.div`
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  height: ${props => props.height}px;
  width: ${props => props.width}px;

  &.fallTo {
    animation: ${props => fallToAnimation(props)} ${FALL_DURATION - 20}ms linear forwards;
  }

  &.shake {
    animation: ${props => shakeAnimation(props.top)} ${SHAKE_DURATION}ms linear forwards;
  }

  &.hasParent {
    z-index: 4;
  }
`;

const FoodItem = (props) => {
  const {
    type,
    position,
    collected,
    id,
    height,
    width,
    image,
    inMenu,
    fallTo,
    parent,
    onParent,
  } = props;
  const styleProps = { height, width };
  const onParentItem = onParent && getItemById(parent, 'scenery');
  const shake = onParentItem && onParentItem.shake && !fallTo ? 'shake' : '';

  if (!inMenu) {
    styleProps.top = position.y;
    styleProps.left = position.x;
  }

  if (fallTo) {
    styleProps.fallToX = fallTo.x;
    styleProps.fallToY = fallTo.y;
    styleProps.fallLeft = fallTo.x < position.x;
  }

  if (!inMenu && collected) {
    return <span />;
  }

  return (
    <StyledFood
      className={`food ${type} food_index_${id} ${fallTo ? 'fallTo' : ''} ${shake} ${parent ? 'hasParent' : ''}`}
      {...styleProps}
    >
      <img src={image} alt="Food" />
    </StyledFood>
  );
};

export default FoodItem;

FoodItem.propTypes = {
  type: PropTypes.string,
  position: PropTypes.object,
  collected: PropTypes.bool,
  id: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
  image: PropTypes.string,
  inMenu: PropTypes.bool,
  fallTo: PropTypes.object,
  parent: PropTypes.object,
  onParent: PropTypes.bool,
};

FoodItem.defaultProps = {
  type: '',
  position: {},
  collected: false,
  id: 0,
  height: 0,
  width: 0,
  image: '',
  inMenu: false,
  fallTo: null,
  parent: null,
  onParent: false,
};
