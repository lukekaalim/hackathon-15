// @flow strict
import { createHTTPClientFromFetch } from '@lukekaalim/http-client';
import { createClient } from '@9now/client';
import { render, Fragment, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import { Rail } from './components/NineNow';
import { Homepage } from './components/Homepage';

const NineNowWeb = () => {
  const [homepageData, setHomePageData] = useState(null);
  useEffect(() => {
    const client = createClient('http://localhost:1243', createHTTPClientFromFetch(fetch, Headers));
    client.getHomepage()
      .then(homepage => setHomePageData(homepage))
      .catch(error => console.error(error));
  }, []);
  
  if (homepageData) {
    const { rails } = homepageData;
    return (
      <Homepage>
        {rails.map(rail => {
          return <Rail cards={rail.cards} callToAction={rail.callToAction} />
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