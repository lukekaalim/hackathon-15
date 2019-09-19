// @flow strict
import type { CallToAction, Route } from '@9now/models';
import { h, Fragment } from 'preact';

type HomepageProps = {
  children: React$Node,
};

export const Homepage = ({ children }: HomepageProps) => {
  return (
    <div class="homepage">
      {children}
    </div>
  );
};