// @flow strict
import { createHTTPClientFromFetch } from '@lukekaalim/http-client';
import { createClient } from '@9now/client';
import { render, Fragment, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import { CardRail } from './components/NineNow';
import { Homepage } from './components/Homepage';

const useHomepage = (client) => {
  const [homepageData, setHomePageData] = useState(null);
  useEffect(() => client.addHomepageListener(homepage => setHomePageData(homepage)), [client]);
  return homepageData;
};

const client = createClient('http://api.sushi.lukekaalim.com', createHTTPClientFromFetch(fetch, Headers));
const NineNowWeb = () => {
  const homepage = useHomepage(client);
  
  if (homepage) {
    const { rails } = homepage;
    return (
      <Homepage>
        {rails.map(rail => {
          if (rail.type !== 'card-rail')
            return 'Unsupported Rail';
          return <CardRail {...rail} />
        })}
      </Homepage>
    )
  }
  return 'Loading';
};

const main = () => {
  const body = document.body;
  if (body) {
    const reactRoot = document.createElement('div');
    body.append(reactRoot);
    render(<NineNowWeb />, reactRoot);
  }
};

main();