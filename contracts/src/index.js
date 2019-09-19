// @flow strict
const { createContract } = require('@lukekaalim/contract');
/*::
import type { Homepage } from '@9now/models';
*/

const homepage/*: Homepage*/ = {
  carousel: { slides: [{ route: { type: 'home' }, imageURL: 'example.com' }] },
  rails: [{
    callToAction: { title: 'Shows', route: { type: 'home' } },
    cards: [{ imageURL: 'example.com', route: { type: 'home' } }],
  }],
};

const getHomepage = createContract('homepageContact', {
  path: '/home',
  headers: [],
  method: 'GET',
  body: '',
}, {
  status: 200,
  headers: [],
  body: JSON.stringify(homepage),
});

const contracts = {
  getHomepage
};

module.exports = {
  contracts,
};
