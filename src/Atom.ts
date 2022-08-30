export type AtomInitialValue<T> = (T extends Function ? never : T) | (() => T);
export type AtomOptions = {};
export type AtomSubscription<T> = (value: T) => void;

export class Atom<T> {
  private _value: T;
  private _opts: AtomOptions;
  private _subscriptions: AtomSubscription<T>[];

  constructor(initialValue: AtomInitialValue<T>, opts?: AtomOptions) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this._value = typeof initialValue === 'function' ? (initialValue as Function)() : initialValue;
    this._opts = { ...opts };
    this._subscriptions = [];
    this.subscribe = this.subscribe.bind(this);
  }

  get value(): T {
    return this._value;
  }

  set value(value: T) {
    this._value = value;
    this._subscriptions.forEach((cb) => cb(value));
  }

  subscribe(subscription: AtomSubscription<T>) {
    this._subscriptions.push(subscription);
    return () => {
      this._subscriptions = this._subscriptions.filter((cb) => cb !== subscription);
    };
  }
}

/** Creates a new Atom with options */
export const createAtom = <T>(initialValue: AtomInitialValue<T>, opts?: AtomOptions): Atom<T> => {
  return new Atom(initialValue, opts);
};
