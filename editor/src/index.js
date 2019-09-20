// @flow strict

import { createHTTPClientFromFetch } from '@lukekaalim/http-client';
import { createClient } from '@9now/client';
import { render, Fragment, h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import { CardRail } from './NineNow';

const useHomepage = (client) => {
  const [homepage, setHomePageData] = useState(null);
  useEffect(() => client.addHomepageListener(newHomepage => setHomePageData(newHomepage)), [client]);
  return [homepage, setHomePageData];
};
const client = createClient('http://api.sushi.lukekaalim.com', createHTTPClientFromFetch(fetch, Headers));

const Homepage = ({ rails }) => {
  return rails.map(rail => {
    if (rail.type !== 'card-rail')
      return 'Unsupported Rail';
    return <CardRail {...rail} />
  })
}

const postRail = async (rail) => {
  console.log(rail);
  const response = await fetch('http://api.sushi.lukekaalim.com/cardRail', { method: 'POST', body: JSON.stringify(rail) });
  console.log(response);
}

const postHomepage = async (rails) => {
  await Promise.all(rails.map(rail => postRail(rail)));
  const response = await fetch('http://api.sushi.lukekaalim.com/home', { method: 'POST', body: JSON.stringify({ rails }) });
};

const RailForm = ({ rail }) => {
  return (
    <form>
      <label>Rail Title</label>
      <input
        type="text"
        onInput={event => postRail({ ...rail, title: event.target.value })}
        value={rail.title}>
      </input>
      <input type="button" value="Add Slide" onClick={() => postRail({
        ...rail, 
        cards: [...rail.cards, { id: Math.floor(Math.random() * 10000).toString(), imageURL: '', title: '', subtitle: '' }],
      })}></input>
      {rail.cards.map((card, index) => {
        const newRail = { ...rail, cards: [...rail.cards] };
        return (
          <section>
            <input type="text"
              onInput={event => {
                newRail.cards[index].imageURL = event.target.value;
                postRail(newRail);
              }}
              value={card.imageURL}
            ></input>
            <input type="text"
              onInput={event => {
                newRail.cards[index].title = event.target.value;
                postRail(newRail);
              }}
              value={card.title}
            ></input>
            <input type="text"
              onInput={event => {
                newRail.cards[index].subtitle = event.target.value;
                postRail(newRail);
              }}
              value={card.subtitle}
            ></input>
            <input type="button"
              onClick={() => {
                newRail.cards = newRail.cards.filter((_, i) => i !== index);
                postRail(newRail);
              }}
              value="Delete"
            ></input>
          </section>
        );
      })}
    </form>
  );
}

const Form = ({ rails }) => {
  return (
    <Fragment>
      {rails.map(rail => {
        return <RailForm rail={rail} />
      })}
      <button onClick={() => postHomepage([...rails, {
        id: Math.floor(Math.random() * 10000).toString(),
        type: 'card-rail',
        cards: [],
        callToAction: null,
        title: '',
      } ] )}>Add Rail</button>
    </Fragment>
  );
};

const Editor = () => {
  const [homepage] = useHomepage(client);
  if (!homepage) {
    return 'Loading';
  }
  return (
    <div className="editor">
      <div className="form">
        <Form rails={homepage.rails} />
      </div>
      <div className="homepage-container">
        <Homepage rails={homepage.rails} />
      </div>
    </div>
  );
};

const main = () => {
  const body = document.body;
  if (body) {
    const reactRoot = document.createElement('div');
    body.append(reactRoot);
    render(<Editor />, reactRoot);
  }
};

main();