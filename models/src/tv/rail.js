// @flow strict
/*::
import type { Model } from '@lukekaalim/model';
*/
import {
  stringModel,
  numberModel,
  modelObject,
  modelDisjointUnion,
  modelLiteral,
  modelArray,
  modelOptional,
} from '@lukekaalim/model';

/*::
export type CallToAction = {
  label: string,
}
*/
const modelCallToAction = modelObject({
  label: stringModel,
});

/*::
export type CardID = string;
export type Card = {
  id: string,
  imageURL: string,
  title: string,
  subtitle: string,
};

export type CardRailID = string;
export type CardRail = {
  id: CardRailID,
  type: 'card-rail',
  cards: Array<Card>,
  callToAction: CallToAction | null,
  title: string,
}

export type PosterID = string;
export type Poster = {
  id: string,
  imageURL: string,
}

export type PosterRailID = string;
export type PosterRail = {
  id: PosterRailID,
  type: 'poster-rail',
  posters: Array<Poster>,
  callToAction: CallToAction | null,
  title: string,
}

export type LiveEventID = string;
export type LiveEvent = {
  id: LiveEventID,
  imageURL: string,
  startTime: number,
  endTime: number,
}
export type LiveEventRailID = string;
export type LiveEventRail = {
  id: LiveEventRailID,
  type: 'live-event-rail',
  events: Array<LiveEvent>,
  callToAction: CallToAction | null,
  title: string,
}

export type Rail = CardRail | PosterRail | LiveEventRail;
*/
export const cardModel/*: Model<Card>*/ = modelObject({
  id: stringModel,
  imageURL: stringModel,
  title: stringModel,
  subtitle: stringModel,
});
export const cardRailModel/*: Model<CardRail>*/ = modelObject({
  id: stringModel,
  type: modelLiteral('card-rail'),
  cards: modelArray(cardModel),
  callToAction: modelOptional(modelCallToAction),
  title: stringModel,
})

export const posterModel/*: Model<Poster>*/ = modelObject({
  id: stringModel,
  imageURL: stringModel,
});
export const posterRailModel/*: Model<PosterRail>*/ = modelObject({
  id: stringModel,
  type: modelLiteral('poster-rail'),
  posters: modelArray(posterModel),
  callToAction: modelOptional(modelCallToAction),
  title: stringModel,
})

export const liveEventModel/*: Model<LiveEvent>*/ = modelObject({
  id: stringModel,
  imageURL: stringModel,
  startTime: numberModel,
  endTime: numberModel,
});
export const liveEventRailModel/*: Model<LiveEventRail>*/ = modelObject({
  id: stringModel,
  type: modelLiteral('live-event-rail'),
  events: modelArray(liveEventModel),
  callToAction: modelOptional(modelCallToAction),
  title: stringModel,
});

export const railModel/*: Model<Rail>*/ = modelDisjointUnion('type', {
  'live-event-rail': liveEventRailModel,
  'poster-rail': posterRailModel,
  'card-rail': cardRailModel,
});
