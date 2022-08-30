import { expectTypeOf } from 'expect-type';

import { Atom, createAtom } from '../src';
import type { AtomSubscription } from '../src';

describe('Atom', () => {
  test('Creating an atom sets the initial value', () => {
    const string = 'string';
    const stringAtom = createAtom(string);
    const number = 999;
    const numberAtom = createAtom(number);
    const object = { x: 1, y: 2, z: 3 };
    const objectAtom = createAtom(object);
    const array = [1, 2, 3];
    const arrayAtom = createAtom(array);
    const func = () => 'test';
    const funcAtom = createAtom(() => func);
    const nestedFunc = { parent: func };
    const nestedFuncAtom = createAtom(nestedFunc);
    const nullAtom = createAtom<null>(null);
    const undefinedAtom = createAtom<undefined>(undefined);
    expect(stringAtom.value).toBe(string);
    expectTypeOf(stringAtom).toMatchTypeOf<Atom<string>>();
    expectTypeOf(stringAtom.value).toMatchTypeOf<string>();
    expect(numberAtom.value).toBe(number);
    expectTypeOf(numberAtom).toMatchTypeOf<Atom<number>>();
    expect(objectAtom.value).toBe(object);
    expectTypeOf(objectAtom).toMatchTypeOf<Atom<{ x: number; y: number; z: number }>>();
    expect(arrayAtom.value).toBe(array);
    expectTypeOf(arrayAtom).toMatchTypeOf<Atom<number[]>>();
    expect(funcAtom.value).toBe(func);
    expect(funcAtom.value()).toBe('test');
    expectTypeOf(funcAtom).toMatchTypeOf<Atom<() => string>>();
    expect(nestedFuncAtom.value).toBe(nestedFunc);
    expect(nestedFuncAtom.value.parent()).toBe('test');
    expectTypeOf(nestedFuncAtom).toMatchTypeOf<Atom<{ parent: () => string }>>();
    expect(nullAtom.value).toBe(null);
    expectTypeOf(nullAtom).toMatchTypeOf<Atom<null>>();
    expect(undefinedAtom.value).toBe(undefined);
    expectTypeOf(undefinedAtom).toMatchTypeOf<Atom<undefined>>();
  });

  test('Updating an atom changes value', () => {
    const stringAtom = createAtom('string');
    const numberAtom = createAtom(999);
    const objectAtom = createAtom<Record<string, number>>({ x: 1, y: 2, z: 3 });
    const arrayAtom = createAtom<(string | number)[]>([1, 2, 3]);
    const funcAtom = createAtom<() => string>(() => () => 'test');
    const nestedFuncAtom = createAtom({ parent: funcAtom.value });
    const nullAtom = createAtom<null>(null);
    const undefinedAtom = createAtom<undefined>(undefined);
    const string = 'new string';
    stringAtom.value = string;
    const number = 1000;
    numberAtom.value = number;
    const object = { a: 9, b: 8, c: 7 };
    objectAtom.value = object;
    const array = ['a', 'b', 'c'];
    arrayAtom.value = array;
    const func = () => 'next';
    funcAtom.value = func;
    const nestedFunc = { parent: func };
    nestedFuncAtom.value = nestedFunc;
    nullAtom.value = null;
    undefinedAtom.value = undefined;
    expect(stringAtom.value).toBe(string);
    expectTypeOf(stringAtom).toMatchTypeOf<Atom<string>>();
    expect(numberAtom.value).toBe(number);
    expectTypeOf(numberAtom).toMatchTypeOf<Atom<number>>();
    expect(objectAtom.value).toBe(object);
    expectTypeOf(objectAtom).toMatchTypeOf<Atom<Record<string, number>>>();
    expect(arrayAtom.value).toBe(array);
    expectTypeOf(arrayAtom).toMatchTypeOf<Atom<(string | number)[]>>();
    expect(funcAtom.value).toBe(func);
    expect(funcAtom.value()).toBe('next');
    expectTypeOf(funcAtom).toMatchTypeOf<Atom<() => string>>();
    expect(nestedFuncAtom.value).toBe(nestedFunc);
    expect(nestedFuncAtom.value.parent()).toBe('next');
    expectTypeOf(nestedFuncAtom).toMatchTypeOf<Atom<{ parent: () => string }>>();
    expect(nullAtom.value).toBe(null);
    expectTypeOf(nullAtom).toMatchTypeOf<Atom<null>>();
    expect(undefinedAtom.value).toBe(undefined);
    expectTypeOf(undefinedAtom).toMatchTypeOf<Atom<undefined>>();
  });

  test('Subscribing to an atom fires subscription callback on update', () => {
    const stringAtom = createAtom<string>('string');
    const numberAtom = createAtom<number>(999);
    const objectAtom = createAtom<object>({ x: 1, y: 2, z: 3 });
    const funcAtom = createAtom<() => any>(() => () => 'test');
    const stringSubscription: AtomSubscription<string> = jest.fn((value) => {
      expectTypeOf(value).toMatchTypeOf<string>();
    });
    stringAtom.subscribe(stringSubscription);
    const string = 'new string';
    stringAtom.value = string;
    const numberSubscription: AtomSubscription<number> = jest.fn((value) => {
      expectTypeOf(value).toMatchTypeOf<number>();
    });
    numberAtom.subscribe(numberSubscription);
    const number = 1000;
    numberAtom.value = number;
    const objectSubscription: AtomSubscription<object> = jest.fn((value) => {
      expectTypeOf(value).toMatchTypeOf<object>();
    });
    objectAtom.subscribe(objectSubscription);
    const object = { a: 9, b: 8, c: 7 };
    objectAtom.value = object;
    const funcSubscription: AtomSubscription<() => any> = jest.fn((value) => {
      expectTypeOf(value).toMatchTypeOf<() => any>();
    });
    funcAtom.subscribe(funcSubscription);
    const func = () => 'next';
    funcAtom.value = func;
    expect(stringSubscription).toBeCalledTimes(1);
    expect(stringSubscription).toBeCalledWith(string);
    expect(numberSubscription).toBeCalledTimes(1);
    expect(numberSubscription).toBeCalledWith(number);
    expect(objectSubscription).toBeCalledTimes(1);
    expect(objectSubscription).toBeCalledWith(object);
    expect(funcSubscription).toBeCalledTimes(1);
    expect(funcSubscription).toBeCalledWith(func);
  });

  test('Unsubscribing to atom does not fire subscription callback on update', () => {
    const stringAtom = createAtom<string>('string');
    const numberAtom = createAtom<number>(999);
    const objectAtom = createAtom<object>({ x: 1, y: 2, z: 3 });
    const funcAtom = createAtom<() => any>(() => () => 'test');
    const stringSubscription: AtomSubscription<string> = jest.fn(() => ({}));
    const unsubscribeStringAtom = stringAtom.subscribe(stringSubscription);
    unsubscribeStringAtom();
    const string = 'new string';
    stringAtom.value = string;
    const numberSubscription: AtomSubscription<number> = jest.fn(() => ({}));
    const unsubscribeNumberAtom = numberAtom.subscribe(numberSubscription);
    unsubscribeNumberAtom();
    const number = 1000;
    numberAtom.value = number;
    const objectSubscription: AtomSubscription<object> = jest.fn(() => ({}));
    const unsubscribeObjectAtom = objectAtom.subscribe(objectSubscription);
    unsubscribeObjectAtom();
    const object = { a: 9, b: 8, c: 7 };
    objectAtom.value = object;
    const funcSubscription: AtomSubscription<() => any> = jest.fn(() => ({}));
    const unsubscribeFuncAtom = funcAtom.subscribe(funcSubscription);
    unsubscribeFuncAtom();
    const func = () => 'next';
    funcAtom.value = func;
    expect(stringSubscription).toBeCalledTimes(0);
    expect(numberSubscription).toBeCalledTimes(0);
    expect(objectSubscription).toBeCalledTimes(0);
    expect(funcSubscription).toBeCalledTimes(0);
  });

  test('Can createAtom with initialValue function', () => {
    type Value = 'light' | 'dark';
    const value = 'light' as Value;
    const atom = createAtom(() => value);
    expect(atom.value).toBe(value);
    expectTypeOf(atom).toMatchTypeOf<Atom<Value>>();

    // SSR example
    let isMockSSR = true;
    const createSSRAtom = () => {
      return createAtom<Value>(() => {
        if (isMockSSR) {
          return 'light';
        }
        return 'dark';
      });
    };
    expect(createSSRAtom().value).toBe('light');
    isMockSSR = false;
    expect(createSSRAtom().value).toBe('dark');

    // @ts-expect-error - should be () => () => 'James'
    createAtom<() => string>(() => 'James');
  });
});
