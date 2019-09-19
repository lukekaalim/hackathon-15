// @flow strict
import { createNineNowComponents } from '@9now/components';
import { h } from 'preact';

const primitives = {
  Text: props => <p style={props.style}>{props.text}</p>,
  Box: props => <div style={props.style}>{props.children}</div>,
  Image: props => <img style={props.style} src={props.source}></img>,
};

export const { Card, Rail } = createNineNowComponents(primitives);
