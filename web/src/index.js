// @flow strict
import { createHTTPClientFromFetch } from '@lukekaalim/http-client';
import { createClient } from '@9now/client';
import { render, Fragment, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import { CardRail } from './components/NineNow';
import { Homepage } from './components/Homepage';

const NineNowWeb = () => {
  const [homepageData, setHomePageData] = useState(null);
  useEffect(() => {
    const client = createClient('http://api.sushi.lukekaalim.com', createHTTPClientFromFetch(fetch, Headers));
    client.getHomepage()
      .then(homepage => setHomePageData(homepage))
      .catch(error => console.error(error));
  }, []);
  
  if (homepageData) {
    const { rails } = homepageData;
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