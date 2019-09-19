// @flow init
const { createListener, createRoute, ok, notFound, internalServerError, badRequest } = require('@lukekaalim/server');
const { createServer } = require('http');
const { readFile } = require('fs').promises;
const { join } = require('path');
const { modelArray, modelObject } = require('@lukekaalim/model')
const { createRailService } = require('./services/railService');
const { cardRailModel, railModel } = require('@9now/models');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*'
};

const homepageUpdateModel = modelObject({
  rails: modelArray(railModel)
});

const main = async (
  bucketName/*: string*/,
  region/*: string*/,
) => {
  const railService = createRailService(bucketName, region);
  const homepageRoute = createRoute('/home', 'GET', async () => {
    try {
      const rails = await railService.getHomepageRails();
      return ok(JSON.stringify({ rails }), corsHeaders)
    } catch (err) {
      console.error(err);
      return internalServerError(JSON.stringify(err.stack), corsHeaders);
    }
  });
  const updateHomepageRoute = createRoute('/home', 'POST', async ({ body }) => {
    try {
      if (!body)
        return badRequest(JSON.stringify({ message: 'missing body!' }));
      const updatedHomepageResult = homepageUpdateModel.from(JSON.parse(body));
      if (updatedHomepageResult.type === 'failure')
        return badRequest(JSON.stringify(updatedHomepageResult));
      await railService.setHomepageRails(updatedHomepageResult.success.rails);
      return ok(JSON.stringify({ message: 'updated' }), corsHeaders)
    } catch (err) {
      console.error(err);
      return internalServerError(JSON.stringify(err.stack), corsHeaders);
    }
  });
  const addCardRail = createRoute('/cardRail', 'POST', async ({ body }) => {
    try {
      if (!body) {
        return badRequest(JSON.stringify({ message: 'missing body!' }));
      }
      const cardRailResult = cardRailModel.from(JSON.parse(body));
      if (cardRailResult.type === 'failure')
        return badRequest(JSON.stringify(cardRailResult));
      await railService.setCardRail(cardRailResult.success)
      return ok(JSON.stringify({ message: 'uploaded' }), corsHeaders)
    } catch (err) {
      console.error(err);
      return internalServerError(JSON.stringify(err.stack), corsHeaders);
    }
  });
  const routes = [addCardRail, homepageRoute, updateHomepageRoute];
  const listener = createListener(routes, () => notFound());
  const server = createServer(listener);
  server.listen(1243, () => console.log(`Listening on http://localhost:${server.address().port}`));
  process.on('SIGINT', () => console.log('Starting Shut Down') || server.close(() => console.log('Shut Down')))
};

const bucketName = process.env['HACK_SERVER_BUCKET_NAME'];
const region = 'ap-southeast-2';

if (bucketName) {
  main(bucketName, region);
} else {
  throw new Error('Missing either HACK_SERVER_BUCKET_NAME, AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY');
}