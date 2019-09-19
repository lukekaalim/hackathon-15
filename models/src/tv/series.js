// @flow strict
/*::
import type { Model } from '@lukekaalim/model';
*/
const {
  modelObject,
  stringModel,
  modelArray,
} = require('@lukekaalim/model');

/*::
export type TvEpisodeID = string;
export type TvEpisode = {
  id: TvEpisodeID,
  title: string,
};
*/
const episodeModel/*: Model<TvEpisode>*/ = modelObject({
  id: stringModel,
  title: stringModel,
});

/*::
export type TvSeasonID = string;
export type TvSeason = {
  id: TvSeasonID,
  title: string,
  episodes: Array<TvEpisodeID>,
};
*/

const seasonModel/*: Model<TvSeason>*/ = modelObject({
  id: stringModel,
  title: stringModel,
  episodes: modelArray(stringModel),
});

/*::
export type TvSeriesID = string;
export type TvSeries = {
  id: TvSeriesID,
  title: string,
  seasons: Array<TvSeasonID>,
};
*/

const seriesModel/*: Model<TvSeries>*/ = modelObject({
  id: stringModel,
  title: stringModel,
  seasons: modelArray(stringModel),
});

module.exports = {
  seriesModel,
  seasonModel,
}