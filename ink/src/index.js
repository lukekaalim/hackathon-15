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

const InkNow = () => {
	const [rails, setRails] = useState(null);
	const client = createClient('http://api.sushi.lukekaalim.com', createHTTPClientFromNodeHttpsRequest(request));
	useEffect(() => {
		client.getHomepage().then(({ rails }) => setRails(rails)).catch(console.error);
	}, []);
	
	if (!rails) {
		return 'Loading';
	}
	return rails.map(rail => {
		if (rail.type !== 'card-rail')
			return 'Not supported';
		return <CardRail key={rail.id} {...rail} />
	});
};

render(React.createElement(InkNow));