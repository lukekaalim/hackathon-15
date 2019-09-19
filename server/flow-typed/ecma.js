// @flow strict

declare class Object {
  static entries<K, V>({ [K]: V }): Array<[K, V]>;
}