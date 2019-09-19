// @flow strict
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