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
  setHomepageRails: (rails: Array<Rail>) => Promise<void>,
  getCardRail: (id: CardRailID) => Promise<CardRail>,
  getPosterRail: (id: PosterRailID) => Promise<PosterRail>,
  getLiveEventRail: (id: LiveEventRailID) => Promise<LiveEventRail>,
  // Only allow editing to the card rail for hackathon purposes
  setCardRail: (cardRail: CardRail) => Promise<void>,
};
*/
/*::
type HomepageRailRef = { type: 'poster-rail' | 'card-rail' | 'live-event-rail', id: string };
*/
const homepageRailRefsModel/*: Model<Array<HomepageRailRef>>*/ = modelArray(modelObject({
  type: modelTagUnion(['poster-rail', 'card-rail', 'live-event-rail']),
  id: stringModel
}));

const createRailService = (
  bucketName/*: string*/,
  region/*: string*/,
)/*: RailService*/ => {
  const client = new AWS.S3({ region });

  const getRail = async /*:: <T>*/(model/*: Model<T>*/, type, id)/*: Promise<T>*/ => {
    const { Body } = await client.getObject({
      Bucket: bucketName,
      Key: `rails/${type}/${id}.json`
    }).promise();
    const cardRailResult = model.from(JSON.parse(Body.toString('utf-8')));
    if (cardRailResult.type === 'failure') throw new Error('Something went wrong!');
    return cardRailResult.success;
  };
  const setRail = async (type, rail) => {
    await client.putObject({
      Bucket: bucketName,
      Key: `rails/${type}/${rail.id}.json`,
      Body: JSON.stringify(rail),
    }).promise();
  };

  const getCardRail = id => getRail(cardRailModel, 'card-rail', id);
  const getPosterRail = id => getRail(posterRailModel, 'poster-rail', id);
  const getLiveEventRail = id => getRail(liveEventRailModel, 'live-event-rail', id);

  const setCardRail = (rail/*: CardRail*/) => setRail('card-rail', rail);

  const setHomepageRails = async (rails) => {
    const railRefs = rails.map(rail => ({ type: rail.type, id: rail.id }));
    await client.putObject({
      Bucket: bucketName,
      Key: `homepageRails.json`,
      Body: JSON.stringify(railRefs),
    }).promise();
  };

  const getHomepageRails = async () => {
    const { Body } = await client.getObject({
      Bucket: bucketName,
      Key: 'homepageRails.json',
    }).promise();
    const railRefsResult = homepageRailRefsModel.from(JSON.parse(Body.toString('utf-8')));
    if (railRefsResult.type === 'failure') throw new Error('Something went wrong!');
    const railRefs = railRefsResult.success;
    const rails = await Promise.all(railRefs.map/*:: <Promise<Rail>>*/(railRef => {
      switch (railRef.type) {
        case 'poster-rail':
          return getPosterRail(railRef.id);
        case 'card-rail':
          return getCardRail(railRef.id);
        case 'live-event-rail':
          return getLiveEventRail(railRef.id);
        default:
          return (railRef.type/*: empty*/);
      }
    }));
    return rails;
  };

  return {
    getHomepageRails,
    setHomepageRails,
    getCardRail,
    getPosterRail,
    getLiveEventRail,
    setCardRail,
  };
};

module.exports = {
  createRailService,
}