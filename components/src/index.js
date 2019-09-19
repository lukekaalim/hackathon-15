// @flow strict
import { createRailComponents } from './Rail';
import type { Primitives } from './primitives';

export const createNineNowComponents = (primitives/*: Primitives*/) => {
  return {
    ...createRailComponents(primitives),
  }
};