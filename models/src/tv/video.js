// @flow strict
/*::
import type { Model } from '@lukekaalim/model';
*/
const {
  modelObject,
  stringModel,
} = require('@lukekaalim/model');

/*::
export type VideoID = string;
export type Video = {
  id: VideoID,
  videoURL: string,
  thumbnailURL: string,
  title: string,
};
*/

const videoModel/*: Model<Video>*/ = modelObject({
  id: stringModel,
  videoURL: stringModel,
  thumbnailURL: stringModel,
  title: stringModel,
});

module.exports = {
  videoModel,
}