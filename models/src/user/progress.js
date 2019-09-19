// @flow strict
/*::
import type { VideoID } from '../tv/video';
import type { Model } from '@lukekaalim/model';
*/
const {
  modelObject,
  stringModel,
  modelArray,
  numberModel,
} = require('@lukekaalim/model');

/*::
type UserID = string;
type VideoProgress = {
  userId: UserID,
  videoId: VideoID,
  progress: number,
};
*/

const videoProgressModel/*: Model<VideoProgress>*/ = modelObject({
  userId: stringModel,
  videoId: stringModel,
  progress: numberModel,
});

module.exports = {
  videoProgressModel,
};