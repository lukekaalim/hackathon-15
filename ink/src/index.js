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

const { Card, Rail } = createNineNowComponents(primitives);

const InkNow = () => {
	const [rails, setRails] = useState();
	const client = createClient('http://api.sushi.lukekaalim.com', createHTTPClientFromNodeHttpsRequest(request));
	useEffect(() => {
		//client.getHomepage().then(rails => setRails(rails)).catch(console.error);
	}, [])
	const card1 = { cardId:'123', imageURL: 'www.google.com', route: { type: 'home' }, title: 'hey', subtitle: 'wow' };
	const card2 = { cardId:'1243', imageURL: 'www.google.com', route: { type: 'home' }, title: 'hey', subtitle: 'wow' };
	const card3 = { cardId:'1253', imageURL: 'www.google.com', route: { type: 'home' }, title: 'hey', subtitle: 'wow' };
	const card5 = { cardId:'1623', imageURL: 'www.google.com', route: { type: 'home' }, title: 'hey', subtitle: 'wow' };
	return <Rail callToAction={null} cards={[card1, card2, card3, card5]} />
};

render(React.createElement(InkNow));