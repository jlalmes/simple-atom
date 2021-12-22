import { renderHook, act } from '@testing-library/react-hooks';

import { createAtom, useAtom } from '../src';

describe('useAtom', () => {
  test('Hook returns atom value and setter function', () => {
    const initial = 'initial';
    const atom = createAtom<string>(initial);
    const { result } = renderHook(() => useAtom(atom));
    expect(result.current[0]).toBe(initial);
    expect(typeof result.current[1]).toBe('function');
  });

  test('Updating atom from hook setter returns new atom value', () => {
    const initial = 'initial';
    const atom = createAtom<string>(initial);
    const { result } = renderHook(() => useAtom(atom));
    const updated = 'updated';
    act(() => {
      result.current[1](updated);
    });
    expect(atom.value).toBe(updated);
    expect(result.current[0]).toBe(updated);
  });

  test('Updating atom outside react returns new atom value', () => {
    const initial = 'initial';
    const atom = createAtom<string>(initial);
    const { result } = renderHook(() => useAtom(atom));
    const updated = 'updated';
    act(() => {
      atom.value = updated;
    });
    expect(atom.value).toBe(updated);
    expect(result.current[0]).toBe(updated);
  });

  test('Setter accepts callback function with previous value', () => {
    const initial = 0;
    const atom = createAtom<number>(initial);
    const { result } = renderHook(() => useAtom(atom));
    act(() => {
      result.current[1]((previous) => previous + 1);
    });
    expect(atom.value).toBe(1);
    expect(result.current[0]).toBe(1);
  });

  test('Can set function types in atom hook', () => {
    const initialFunction = jest.fn(() => {});
    const atom = createAtom<() => void>(initialFunction);
    const { result } = renderHook(() => useAtom(atom));
    expect(atom.value).toBe(initialFunction);
    expect(result.current[0]).toBe(initialFunction);
    const updatedFunction = jest.fn(() => {});
    act(() => {
      result.current[1](() => updatedFunction);
    });
    expect(atom.value).toBe(updatedFunction);
    expect(result.current[0]).toBe(updatedFunction);
    expect(updatedFunction).toBeCalledTimes(0);
  });
});
