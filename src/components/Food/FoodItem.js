import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components';

import { SHAKE_DURATION, FALL_DURATION } from 'components/constants';
import { getItemById } from 'actions';

import 'less/Food.less';

const getLeftPos = (left, fallToX, fallLeft, offset) => {
  return fallLeft ? left - ((left - fallToX) * offset) : left + ((fallToX - left) * offset);
};

const shake = (top) => {
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

const fallTo = (props) => {
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
      top: ${fallToY - (fallToY * .04)}px;
      left: ${getLeftPos(left, fallToX, fallLeft, .5)}px;
    }
    80% {
      top: ${fallToY}px;
      left: ${getLeftPos(left, fallToX, fallLeft, .65)}px;
    }
    90% {
      top: ${fallToY - (fallToY * .02)}px;
      left: ${getLeftPos(left, fallToX, fallLeft, .8)}px;
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
    animation: ${props => fallTo(props)} ${FALL_DURATION - 20}ms linear;
  }

  &.shake {
    animation: ${props => shake(props.top)} ${SHAKE_DURATION}ms linear;
  }

  &.hasParent {
    z-index: 4;
  }
`;

class FoodItem extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
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
      onParent
    } = this.props;
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
        <img src={image} />
      </StyledFood>
    )
  }
}

export default FoodItem;
