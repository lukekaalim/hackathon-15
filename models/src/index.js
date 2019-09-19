// @flow strict
const {
  modelObject,
  stringModel,
  nameModel,
  modelArray,
  modelDisjointUnion,
  modelLiteral,
  modelOptional,
} = require('@lukekaalim/model');
/*::
import type { Model } from '@lukekaalim/model';

export type Route =
  | { type: 'home' };

export type CallToAction = {
  title: string,
  route: Route,
};

export type Carousel = {
  slides: Array<{ imageURL: string }>,
};

export type Card = {
  cardId: string,
  imageURL: string,
  route: Route,
  title: string,
  subtitle: string,
};

export type Rail = {
  railId: string,
  callToAction: CallToAction | null,
  cards: Array<Card>,
};

export type Homepage = {
  homepageId: string,
  carousel: Carousel,
  rails: Array<Rail>
};
*/

const routeModel/*: Model<Route>*/ = nameModel('9Now/Route', modelDisjointUnion('type', {
  'home': modelObject({ type: modelLiteral('home') }),
}));

const callToActionModel/*: Model<CallToAction>*/ = nameModel('9Now/CallToAction', modelObject({
  title: stringModel,
  route: routeModel,
}));

const carouselModel/*: Model<Carousel>*/ = nameModel('9Now/Carousel', modelObject({
  slides: modelArray(modelObject({
    imageURL: stringModel,
    route: routeModel,
  })),
}));

const cardModel/*: Model<Card>*/ = nameModel('9Now/Card', modelObject({
  cardId: stringModel,
  imageURL: stringModel,
  route: routeModel,
  title: stringModel,
  subtitle: stringModel,
}))

const railModel/*: Model<Rail>*/ = nameModel('9Now/Rail', modelObject({
  railId: stringModel,
  callToAction: modelOptional(callToActionModel),
  cards: modelArray(cardModel),
}));

const homepageModel/*: Model<Homepage>*/ = nameModel('9Now/Homepage', modelObject({
  homepageId: stringModel,
  carousel: carouselModel,
  rails: modelArray(railModel),
}));

module.exports = {
  homepageModel,
  railModel,
  carouselModel,
  callToActionModel,
  routeModel,
};