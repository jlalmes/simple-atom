export type AtomSubscription<T> = (value: T) => void;

export class Atom<T> {
  private _value: T;
  private _subscriptions: AtomSubscription<T>[];

  constructor(initialValue: T) {
    this._value = initialValue;
    this._subscriptions = [];
    this.subscribe = this.subscribe.bind(this);
  }

  get value() {
    return this._value;
  }

  set value(value: T) {
    this._value = value;
    this._subscriptions.forEach((cb) => cb(value));
  }

  subscribe(subscription: AtomSubscription<T>) {
    this._subscriptions = [...this._subscriptions, subscription];
    return () => {
      this._subscriptions = this._subscriptions.filter((cb) => cb !== subscription);
    };
  }
}

export const createAtom = <T>(initialValue: T) => new Atom<T>(initialValue);
