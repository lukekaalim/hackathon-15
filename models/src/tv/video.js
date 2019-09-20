// @flow strict
/*::
import type { Model } from '@lukekaalim/model';
*/
import {
  modelObject,
  stringModel,
} from '@lukekaalim/model';

/*::
export type VideoID = string;
export type Video = {
  id: VideoID,
  videoURL: string,
  thumbnailURL: string,
  title: string,
};
*/

export const videoModel/*: Model<Video>*/ = modelObject({
  id: stringModel,
  videoURL: stringModel,
  thumbnailURL: stringModel,
  title: stringModel,
});
