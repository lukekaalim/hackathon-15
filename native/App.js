// @flow strict
import React from 'react';
import * as Font from 'expo-font';
import { createHTTPClientFromFetch } from '@lukekaalim/http-client';
import { createClient } from '@9now/client';
import { StyleSheet, Text, View, Image } from 'react-native';
import { createNineNowComponents } from '@9now/components';

const { useState, useEffect } = React;

const primitives = {
  Text: ({ style = {}, text = '' }) => {
    const nativeStyle = {
      fontFamily: 'hurme',
      fontSize: style['font-size'],
      color: style['color']
    };
    return <Text style={nativeStyle}>{text}</Text>
  },
  Box: ({ style = {}, children }) => {
    const nativeStyle = {
      ...style,
    };
    return <View style={nativeStyle}>{children}</View>
  },
  Image: ({ style = {}, source }) => {
    const nativeStyle = {
      width: style['width'],
      height: style['height']
    };
    console.log(source);
    return <Image style={nativeStyle} source={{ uri: source }}></Image>;
  },
};

const { Card, Rail } = createNineNowComponents(primitives);

const client = createClient('http://api.sushi.lukekaalim.com', createHTTPClientFromFetch(fetch, Headers))

export default function App() {
  const [homepageData, setHomePageData] = useState(null);
  const [fontLoaded, setFontLoaded] = useState(false);
  useEffect(() => {
    client.getHomepage()
      .then(homepage => setHomePageData(homepage))
      .catch(error => console.error(error));
  }, []);
  console.log('RUNNGIN');
  useEffect(() => {
    Font.loadAsync({ hurme: require('./assets/fonts/Hurme.otf') }).then(() => setFontLoaded(true))
  }, []);

  if (fontLoaded && homepageData) {
    console.log(fontLoaded)
    return (
      <View style={styles.container}>
        {homepageData.rails.map(rail => (
          <Rail key={JSON.stringify(rail.cards)} callToAction={rail.callToAction} cards={rail.cards} />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Loading</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(17, 22, 25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
