// @flow strict
/*::
import type { Homepage } from '@9now/models';
import type { Result } from '@lukekaalim/result';
import type { HTTPClient } from '@lukekaalim/http-client';

type Client = {
  getHomepage: () => Promise<Homepage>,
};
*/
const { homepageModel } = require('@9now/models');

const trySuccess = /*:: <S, F>*/(result/*: Result<S, F>*/)/*: S*/ => {
  if (result.type === 'failure')
    throw new Error(result.failure);
  return result.success;
}

const createClient = (
  host/*: string*/,
  client/*: HTTPClient*/
) /*: Client*/ => {
  const getHomepage = async () => {
    const response = trySuccess(await client.request(new URL('/home', host).href));
    if (response.status !== 200)
      throw new Error(response.body);
    const homepage = trySuccess(homepageModel.from(JSON.parse(response.body)));
    return homepage;
  };
  return {
    getHomepage,
  };
};

module.exports = {
  createClient,
};
