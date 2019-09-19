// @flow init
const { createListener, createRoute, ok, notFound, internalServerError } = require('@lukekaalim/server');
const { createServer } = require('http');
const { readFile } = require('fs').promises;
const { join } = require('path');
const { homepageModel } = require('@9now/models');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*'
};

const main = async () => {
  const homepageRoute = createRoute('/home', 'GET', async () => {
    try {
      const fileContents = await readFile(join(__dirname, 'home.json'), 'utf-8');
      const homepageResult = homepageModel.from(JSON.parse(fileContents));
      if (homepageResult.type === 'success')
        return ok(JSON.stringify(homepageResult.success), corsHeaders)
      return internalServerError(JSON.stringify(homepageResult.failure.message), corsHeaders);
    } catch (err) {
      console.error(err);
      return internalServerError(JSON.stringify(err.stack), corsHeaders);
    }
  });
  const routes = [homepageRoute];
  const listener = createListener(routes, () => notFound());
  const server = createServer(listener);
  server.listen(1243, () => console.log(`Listening on http://localhost:${server.address().port}`));
  process.on('SIGINT', () => console.log('Starting Shut Down') || server.close(() => console.log('Shut Down')))
};

main();