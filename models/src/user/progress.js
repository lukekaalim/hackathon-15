// @flow strict
/*::
import type { VideoID } from '../tv/video';
import type { Model } from '@lukekaalim/model';
*/
import {
  modelObject,
  stringModel,
  modelArray,
  numberModel,
} from '@lukekaalim/model';

/*::
type UserID = string;
type VideoProgress = {
  userId: UserID,
  videoId: VideoID,
  progress: number,
};
*/

export const videoProgressModel/*: Model<VideoProgress>*/ = modelObject({
  userId: stringModel,
  videoId: stringModel,
  progress: numberModel,
});