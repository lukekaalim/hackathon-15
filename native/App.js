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
      color: style['color'],
      marginTop: style['margin-top'],
      marginBottom: style['margin-bottom'],
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

const { Card, CardRail } = createNineNowComponents(primitives);

const client = createClient('http://api.sushi.lukekaalim.com', createHTTPClientFromFetch(fetch, Headers))

const useHomepage = (client) => {
  const [homepageData, setHomePageData] = useState(null);
  useEffect(() => client.addHomepageListener(homepage => setHomePageData(homepage)), [client]);
  return homepageData;
};

export default function App() {
  const homepage = useHomepage(client);
  const [fontLoaded, setFontLoaded] = useState(false);
  useEffect(() => {
    Font.loadAsync({ hurme: require('./assets/fonts/Hurme.otf') }).then(() => setFontLoaded(true))
  }, []);

  if (fontLoaded && homepage) {
    return (
      <View style={styles.container}>
        {homepage.rails.map(rail => {
          switch (rail.type) {
            case 'card-rail':
              return <CardRail key={rail.id} {...rail} />
            default:
              return <Text>UnsupportedRail</Text>
          }
        })}
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
