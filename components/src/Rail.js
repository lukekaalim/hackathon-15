// @flow strict
import type { CallToAction, Route, Card as CardData } from '@9now/models';
import type { Primitives } from './primitives';
import React from 'react';

const middleCardStyle = {
  'margin-left': 4,
  'margin-right': 4,
};
const firstCardStyle = {
  'margin-left': 0,
  'margin-right': 4,
};
const lastCardStyle = {
  'margin-left': 4,
  'margin-right': 0,
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

type CardProps = {
  imageURL: string,
  route: Route,
  position?: 'first' | 'middle' | 'last',
  title: string,
  subtitle: string,
};

const createCard = ({ Box, Text, Image }) => ({ imageURL, title, subtitle, position = 'middle' }: CardProps) => {
  const cardStyle = getCardStyle(position);
  return (
    <Box style={cardStyle}>
      <Image style={cardImageStyle} source={imageURL} />
      <Text style={cardTitleStyle} text="The Block"/>
      <Text style={cartSubtitleStyle} text="Episode 28"/>
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

type RailProps = {
  callToAction: CallToAction | null,
  cards: Array<CardData>,
};

const createRail = ({ Box, Text, Image }, Card) => ({ cards }/*: RailProps*/) => {
  return (
    <Box>
      <Text style={railTitleStyle} text="Recently Added" />
      <Box style={railCardContainerStyle}>
        {cards.map(card => (
          <Card
            subtitle={card.subtitle}
            title={card.title}
            imageURL={card.imageURL}
            route={card.route}
          />
        ))}
      </Box>
    </Box>
  )
};

export const createRailComponents = (primitives: Primitives) => {
  const Card = createCard(primitives);
  const Rail = createRail(primitives, Card);
  return { Card, Rail };
};
