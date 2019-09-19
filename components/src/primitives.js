// @flow strict

type BoxProps = {
  style?: {|
    'display'?: 'flex',
    'flex-direction'?: 'row' | 'column',
    'margin-left'?: number,
    'margin-right'?: number;
  |},
  children: React$Node,
};

type TextProps = {
  text: string,
  style?: {|
    'color'?: string,
    'font-weight'?: number,
    'text-transform'?: 'uppercase',
    'font-size'?: number,
    'font-family'?: 'Hurme',
    'margin-top'?: number,
    'margin-bottom'?: number,
    'margin'?: number,
  |}
};

type ImageProps = {
  source: string,
  style: {
    width: number,
    height: number,
  }
}

export type Primitives = {
  Box: React$ComponentType<BoxProps>,
  Text: React$ComponentType<TextProps>,
  Image: React$ComponentType<ImageProps>,
};