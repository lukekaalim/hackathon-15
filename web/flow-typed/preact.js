// @flow strict

declare module "preact" {
  declare export type Context<T> = {
    Provider: React$ComponentType<{
      value: T,
      children?: React$Node,
      ...
    }>
  };
  declare export function createContext<T>(initalContext?: T): Context<T>;
  declare export function h<Props>(component: React$Component<Props>, props: Props, children?: React$Node): React$Node;
  declare export var Fragment: ({ children?: React$Node, ... }) => React$Node;
  declare export function render(node: React$Node, element: HTMLElement): void;
}

declare module "preact/hooks" {
  import type { Context } from 'preact';
  declare export function useContext<T>(context: Context<T>): T;
  declare export function useState<T>(initialState: T): [T, T => void];
  declare export function useEffect<T>(effect: () => (void | () => mixed), dependencies: Array<mixed>): void;
}