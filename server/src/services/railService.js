// @flow strict
/*::
import type { Rail, CardRail, PosterRail, LiveEventRail, CardRailID, PosterRailID, LiveEventRailID } from '@9now/models';
import type { Model } from '@lukekaalim/model';
*/
const { modelArray, stringModel, modelObject, modelDisjointUnion, modelLiteral, modelTagUnion } = require('@lukekaalim/model')
const { cardRailModel, posterRailModel, liveEventRailModel } = require('@9now/models');
const AWS = require('aws-sdk');

/*::
export type RailService = {
  getHomepageRails: () => Promise<Array<Rail>>,
  //setHomepageRails: (rails: Array<Rail>) => Promise<Array<Rail>>,
  getCardRail: (id: CardRailID) => Promise<CardRail>,
  getPosterRail: (id: PosterRailID) => Promise<PosterRail>,
  getLiveEventRail: (id: LiveEventRailID) => Promise<LiveEventRail>,
  // Only allow editing to the card rail for hackathon purposes
  //setCardRail: (id: CardRailID, CardRail) => Promise<CardRail>,
};
*/
/*::
type HomepageRailRef = { type: 'poster' | 'card' | 'liveEvent', id: string };
*/
const homepageRailRefsModel/*: Model<Array<HomepageRailRef>>*/ = modelArray(modelObject({
  type: modelTagUnion(['poster', 'card', 'liveEvent']),
  id: stringModel
}));

const createRailService = (
  bucketName/*: string*/,
  region/*: string*/,
)/*: RailService*/ => {
  const client = new AWS.S3({ region });

  const getRail = async /*:: <T>*/(model/*: Model<T>*/, type, id)/*: Promise<T>*/ => {
    console.log(`Getting rails/${type}/${id}.json`);
    const { Body } = await client.getObject({
      Bucket: bucketName,
      Key: `rails/${type}/${id}.json`
    }).promise();
    const cardRailResult = model.from(JSON.parse(Body.toString('utf-8')));
    if (cardRailResult.type === 'failure') throw new Error('Something went wrong!');
    return cardRailResult.success;
  };

  const getCardRail = id => getRail(cardRailModel, 'poster', id);
  const getPosterRail = id => getRail(posterRailModel, 'card', id);
  const getLiveEventRail = id => getRail(liveEventRailModel, 'liveEvent', id);

  const getHomepageRails = async () => {
    console.log('Getting homepageRails.json');
    const { Body } = await client.getObject({
      Bucket: bucketName,
      Key: 'homepageRails.json',
    }).promise();
    const railRefsResult = homepageRailRefsModel.from(JSON.parse(Body.toString('utf-8')));
    if (railRefsResult.type === 'failure') throw new Error('Something went wrong!');
    const railRefs = railRefsResult.success;
    const rails = await Promise.all(railRefs.map/*:: <Promise<Rail>>*/(railRef => {
      switch (railRef.type) {
        case 'poster':
          return getPosterRail(railRef.id);
        case 'card':
          return getCardRail(railRef.id);
        case 'liveEvent':
          return getLiveEventRail(railRef.id);
        default:
          return (railRef.type/*: empty*/);
      }
    }));
    return rails;
  };

  return {
    getHomepageRails,
    getCardRail,
    getPosterRail,
    getLiveEventRail,
  };
};

module.exports = {
  createRailService,
}