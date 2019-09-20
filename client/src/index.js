// @flow strict
/*::
import type { Rail } from '@9now/models';
import type { Result } from '@lukekaalim/result';
import type { HTTPClient } from '@lukekaalim/http-client';

type Client = {
  getHomepage: () => Promise<{ rails: Array<Rail> }>,
  addHomepageListener: (listener: ({ rails: Array<Rail> }) => void) => () => void,
};
*/
const { railModel } = require('@9now/models');
const { modelArray, modelObject } = require('@lukekaalim/model');

const trySuccess = /*:: <S, F>*/(result/*: Result<S, F>*/)/*: S*/ => {
  if (result.type === 'failure')
    throw new Error(result.failure);
  return result.success;
}

const homepageResponseModel = modelObject({
  rails: modelArray(railModel),
});

const createClient = (
  host/*: string*/,
  client/*: HTTPClient*/
) /*: Client*/ => {
  const homepageListeners = new Set();
  let intervalID = null;
  const getHomepage = async () => {
    const response = trySuccess(await client.request(new URL('/home', host).href));
    if (response.status !== 200)
      throw new Error(response.body);
    const homepage = trySuccess(homepageResponseModel.from(JSON.parse(response.body)));
    return homepage;
  };
  const addHomepageListener = (listener) => {
    if (homepageListeners.size === 0) {
      startUpdates();
    }
    homepageListeners.add(listener);
    return () => {
      if (homepageListeners.size === 1) {
        stopUpdates();
      }
      homepageListeners.delete(listener);
    };
  };
  const startUpdates = () => {
    clearInterval(intervalID);
    intervalID = setInterval(async () => {
      const homepage = await getHomepage();
      [...homepageListeners].map(listener => listener(homepage));
    }, 4000);
  }
  const stopUpdates = () => {
    clearInterval(intervalID);
  }
  return {
    getHomepage,
    addHomepageListener,
  };
};

module.exports = {
  createClient,
};
