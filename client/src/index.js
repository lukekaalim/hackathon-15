// @flow strict
/*::
import type { Rail } from '@9now/models';
import type { Result } from '@lukekaalim/result';
import type { HTTPClient } from '@lukekaalim/http-client';

type Client = {
  getHomepage: () => Promise<{ rails: Array<Rail> }>,
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
  const getHomepage = async () => {
    const response = trySuccess(await client.request(new URL('/home', host).href));
    if (response.status !== 200)
      throw new Error(response.body);
    const homepage = trySuccess(homepageResponseModel.from(JSON.parse(response.body)));
    return homepage;
  };
  return {
    getHomepage,
  };
};

module.exports = {
  createClient,
};
