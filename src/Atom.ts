// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/deep-freeze/index.d.ts
export type DeepReadonly<T> = T extends Function ? T : { readonly [P in keyof T]: DeepReadonly<T[P]> };

// https://github.com/substack/deep-freeze/blob/master/index.js
const deepFreeze = <T>(o: any): DeepReadonly<T> => {
  // Don't freeze in production for better performance
  if (process.env.NODE_ENV === 'production') {
    return o;
  }

  if (o && (typeof o === 'object' || typeof o === 'function')) {
    Object.freeze(o);
    Object.getOwnPropertyNames(o).forEach((prop) => {
      if (
        Object.prototype.hasOwnProperty.call(o, prop)
          && o[prop]
          && (typeof o === 'object' || (prop !== 'caller' && prop !== 'callee' && prop !== 'arguments'))
          && (typeof o[prop] === 'object' || typeof o[prop] === 'function')
          && !Object.isFrozen(o[prop])
      ) {
        deepFreeze(o[prop]);
      }
    });
  }

  return o;
};

export type AtomSubscription<T> = (value: DeepReadonly<T>) => void;

export class Atom<T> {
  private _value: DeepReadonly<T>;
  private _subscriptions: AtomSubscription<T>[];

  constructor(initialValue: T) {
    this._value = deepFreeze<T>(initialValue);
    this._subscriptions = [];
    this.subscribe = this.subscribe.bind(this);
  }

  // @ts-expect-error
  // ts(2380) The return type of a 'get' accessor must be assignable to its 'set' accessor type.
  // 'T' could be instantiated with an arbitrary type which could be unrelated to 'DeepReadonly<T>'.
  get value(): DeepReadonly<T> {
    return this._value;
  }

  set value(value: T) {
    const nextValue = deepFreeze<T>(value);
    this._value = nextValue;
    this._subscriptions.forEach((cb) => cb(nextValue));
  }

  subscribe(subscription: AtomSubscription<T>) {
    this._subscriptions = [...this._subscriptions, subscription];
    return () => {
      this._subscriptions = this._subscriptions.filter((cb) => cb !== subscription);
    };
  }
}

export const createAtom = <T>(initialValue: T) => new Atom<T>(initialValue);
