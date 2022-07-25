import { createAtom } from '../src';
import type { AtomSubscription } from '../src';

describe('Atom', () => {
  test('Creating an atom sets the initial value', () => {
    const string = 'string';
    const stringAtom = createAtom<string>(string);
    const number = 999;
    const numberAtom = createAtom<number>(number);
    const object = { x: 1, y: 2, z: 3 };
    const objectAtom = createAtom<object>(object);
    const array = [1, 2, 3];
    const arrayAtom = createAtom<number[]>(array);
    const func = () => 'test';
    const funcAtom = createAtom<() => any>(func);
    const nestedFunc = { parent: func };
    const nestedFuncAtom = createAtom<{ parent: () => any }>(nestedFunc);
    const nullAtom = createAtom<null>(null);
    const undefinedAtom = createAtom<undefined>(undefined);
    expect(stringAtom.value).toBe(string);
    expect(numberAtom.value).toBe(number);
    expect(objectAtom.value).toBe(object);
    expect(arrayAtom.value).toBe(array);
    expect(funcAtom.value).toBe(func);
    expect(funcAtom.value()).toBe('test');
    expect(nestedFuncAtom.value).toBe(nestedFunc);
    expect(nestedFuncAtom.value.parent()).toBe('test');
    expect(nullAtom.value).toBe(null);
    expect(undefinedAtom.value).toBe(undefined);
  });

  test('Updating an atom changes value', () => {
    const stringAtom = createAtom<string>('string');
    const numberAtom = createAtom<number>(999);
    const objectAtom = createAtom<object>({ x: 1, y: 2, z: 3 });
    const arrayAtom = createAtom<number[]>([1, 2, 3]);
    const funcAtom = createAtom<() => any>(() => 'test');
    const nestedFuncAtom = createAtom<{ parent: () => any }>({ parent: funcAtom.value });
    const string = 'new string';
    stringAtom.value = string;
    const number = 1000;
    numberAtom.value = number;
    const object = { a: 9, b: 8, c: 7 };
    objectAtom.value = object;
    const array = [9, 8, 7];
    arrayAtom.value = array;
    const func = () => 'next';
    funcAtom.value = func;
    const nestedFunc = { parent: func };
    nestedFuncAtom.value = nestedFunc;
    expect(stringAtom.value).toBe(string);
    expect(numberAtom.value).toBe(number);
    expect(objectAtom.value).toBe(object);
    expect(arrayAtom.value).toBe(array);
    expect(funcAtom.value).toBe(func);
    expect(funcAtom.value()).toBe('next');
    expect(nestedFuncAtom.value).toBe(nestedFunc);
    expect(nestedFuncAtom.value.parent()).toBe('next');
  });

  test('Subscribing to an atom fires subscription callback on update', () => {
    const stringAtom = createAtom<string>('string');
    const numberAtom = createAtom<number>(999);
    const objectAtom = createAtom<object>({ x: 1, y: 2, z: 3 });
    const funcAtom = createAtom<() => any>(() => 'test');
    const stringSubscription: AtomSubscription<string> = jest.fn(() => ({}));
    stringAtom.subscribe(stringSubscription);
    const string = 'new string';
    stringAtom.value = string;
    const numberSubscription: AtomSubscription<number> = jest.fn(() => ({}));
    numberAtom.subscribe(numberSubscription);
    const number = 1000;
    numberAtom.value = number;
    const objectSubscription: AtomSubscription<object> = jest.fn(() => ({}));
    objectAtom.subscribe(objectSubscription);
    const object = { a: 9, b: 8, c: 7 };
    objectAtom.value = object;
    const funcSubscription: AtomSubscription<() => any> = jest.fn(() => ({}));
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
    const funcAtom = createAtom<() => any>(() => 'test');
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

  test('Updating nested object atom value throws TypeError', () => {
    type NestedObject = { parent: { child: number } };
    const nestedObjectAtom = createAtom<NestedObject>({ parent: { child: 0 } });
    const nestedObjectSubscription: AtomSubscription<NestedObject> = jest.fn(() => ({}));
    nestedObjectAtom.subscribe(nestedObjectSubscription);
    expect(nestedObjectAtom.value.parent.child).toBe(0);
    expect(nestedObjectSubscription).toBeCalledTimes(0);
  });

  test('Mutating array atom value throws TypeError', () => {
    type NestedArray = { parent: number[] };
    const nestedArrayAtom = createAtom<NestedArray>({ parent: [1, 3, 2, 4] });
    const nestedArraySubscription: AtomSubscription<NestedArray> = jest.fn(() => ({}));
    nestedArrayAtom.subscribe(nestedArraySubscription);
    expect(nestedArrayAtom.value.parent).toEqual([1, 3, 2, 4]);
    expect(nestedArraySubscription).toBeCalledTimes(0);
    nestedArrayAtom.value = {
      ...nestedArrayAtom.value,
      parent: [...nestedArrayAtom.value.parent].sort(),
    };
    expect(nestedArrayAtom.value.parent).toEqual([1, 2, 3, 4]);
    expect(nestedArraySubscription).toBeCalledTimes(1);
  });

  test('Name option sets atom name', () => {
    const firstName = 'James';
    const jobTitle = 'Developer';
    const namedAtom = createAtom(firstName, { name: 'firstName' });
    const unnamedAtom = createAtom(jobTitle);
    expect(namedAtom.name).toBe('firstName');
    expect(unnamedAtom.name).toBe(undefined);
  });
});
