// @flow strict
import type { CallToAction, Card as CardData, CardRail as CardRailData } from '@9now/models';
import type { Primitives } from './primitives';
import React from 'react';

const middleCardStyle = {
  'margin-left': 4,
  'margin-right': 4,
  'flex-direction': 'column',
};
const firstCardStyle = {
  'margin-left': 0,
  'margin-right': 4,
  'flex-direction': 'column',
};
const lastCardStyle = {
  'margin-left': 4,
  'margin-right': 0,
  'flex-direction': 'column',
};
const cardTitleStyle = {
  'color': 'white',
  'font-weight': 400,
  'text-transform': 'uppercase',
  'font-size': 15,
  'font-family': 'Hurme',
  'margin-top': 8,
  'margin-bottom': 4,
};
const cartSubtitleStyle = {
  'font-size': 14,
  'font-weight': 400,
  'font-family': 'Hurme',
  'margin': 0,
  'color': '#9da2a5',
};
const cardImageStyle = {
  width: 320,
  height: 180,
};

const getCardStyle = position => {
  switch (position) {
    case 'first':
      return firstCardStyle;
    case 'last':
      return lastCardStyle;
    case 'middle':
      return middleCardStyle;
  }
};

type CardProps = CardData & {
  position?: 'first' | 'middle' | 'last',
};

const createCard = ({ Box, Text, Image }) => ({ imageURL, title, subtitle, position = 'middle' }: CardProps) => {
  const cardStyle = getCardStyle(position);
  return (
    <Box style={cardStyle}>
      <Image style={cardImageStyle} source={imageURL} />
      <Text style={cardTitleStyle} text={title}/>
      <Text style={cartSubtitleStyle} text={subtitle}/>
    </Box>
  );
};

const railTitleStyle = {
  'color': 'white',
  'font-family': 'Hurme',
  'font-size': 20,
  'font-weight': 600,
  'margin': 0,
  'margin-bottom': 10,
};

const railCardContainerStyle = {
  'display': 'flex',
  'flex-direction': 'row',
}

const railStyle = {
  'flex-direction': 'column',
}

const createCardRail = ({ Box, Text, Image }, Card) => ({ title, cards }/*: CardRailData*/) => {
  return (
    <Box style={railStyle}>
      <Text style={railTitleStyle} text={title} />
      <Box style={railCardContainerStyle}>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            id={card.id}
            subtitle={card.subtitle}
            title={card.title}
            imageURL={card.imageURL}
            position={index === 0 ? 'first' : index === cards.length - 1 ? 'last' : 'middle'}
          />
        ))}
      </Box>
    </Box>
  )
};

export const createRailComponents = (primitives: Primitives) => {
  const Card = createCard(primitives);
  const CardRail = createCardRail(primitives, Card);
  return { Card, CardRail };
};
