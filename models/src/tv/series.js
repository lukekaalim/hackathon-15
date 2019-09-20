// @flow strict
/*::
import type { Model } from '@lukekaalim/model';
*/
import {
  modelObject,
  stringModel,
  modelArray,
} from '@lukekaalim/model';

/*::
export type TvEpisodeID = string;
export type TvEpisode = {
  id: TvEpisodeID,
  title: string,
};
*/
export const episodeModel/*: Model<TvEpisode>*/ = modelObject({
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

export const seasonModel/*: Model<TvSeason>*/ = modelObject({
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

export const seriesModel/*: Model<TvSeries>*/ = modelObject({
  id: stringModel,
  title: stringModel,
  seasons: modelArray(stringModel),
});
