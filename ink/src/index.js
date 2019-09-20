// @flow strict
const React = require('react');
const { render, Color, Box, Text } = require('ink');
const { createHTTPClientFromNodeHttpsRequest } = require('@lukekaalim/http-client');
const { request } = require('http');
const { createClient } = require('@9now/client');
const { createNineNowComponents } = require('@9now/components');
const { useEffect, useState } = React;

const primitives = {
	Box: ({ style = {}, children }) => {
		return <Box
			marginLeft={style['margin-left']}
			marginRight={style['margin-right']}
			flexDirection={style['flex-direction'] || 'row'}
		>{children}</Box>
	},
	Text: ({ text }) => <Box>{text}</Box>,
	Image: ({ style = {}, source }) => {
		return <Box><Text>{source}</Text></Box>;
	},
};

const { Card, CardRail } = createNineNowComponents(primitives);


const useHomepage = (client) => {
  const [homepageData, setHomePageData] = useState(null);
  useEffect(() => client.addHomepageListener(homepage => setHomePageData(homepage)), [client]);
  return homepageData;
};
const client = createClient('http://api.sushi.lukekaalim.com', createHTTPClientFromNodeHttpsRequest(request));

const InkNow = () => {
	const homepage = useHomepage(client);
	
	if (!homepage) {
		return 'Loading';
	}
	return homepage.rails.map(rail => {
		if (rail.type !== 'card-rail')
			return 'Not supported';
		return <CardRail key={rail.id} {...rail} />
	});
};

render(React.createElement(InkNow));