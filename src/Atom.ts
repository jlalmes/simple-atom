export type AtomSubscription<T> = (value: T) => void;

export type AtomOptions = {
  name: string;
};

export class Atom<T> {
  private _value: T;
  private _subscriptions: AtomSubscription<T>[];
  private _name?: string;

  constructor(initialValue: T, opts?: AtomOptions) {
    this._value = initialValue;
    this._subscriptions = [];
    this.subscribe = this.subscribe.bind(this);
    this._name = opts?.name;
  }

  get name() {
    return this._name;
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

/** Create a new atom function with options */
export const createAtom = <T>(initialValue: T, opts?: AtomOptions) =>
  new Atom<T>(initialValue, opts);
