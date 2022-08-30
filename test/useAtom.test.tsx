import { render } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import { expectTypeOf } from 'expect-type';
import React, { useEffect } from 'react';

import { SetAtomValue, createAtom, useAtom } from '../src';

describe('useAtom', () => {
  test('Hook returns atom value and setter function', () => {
    const initial = 'initial';
    const atom = createAtom<string>(initial);
    const { result } = renderHook(() => useAtom(atom));
    expect(result.current[0]).toBe(initial);
    expectTypeOf(result.current[0]).toMatchTypeOf<string>();
    expect(typeof result.current[1]).toBe('function');
    expectTypeOf(result.current[1]).toMatchTypeOf<(value: SetAtomValue<string>) => void>();
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
    const mock = jest.fn();
    const initialFn = () => {
      mock();
      return 'initial';
    };
    const atom = createAtom(() => initialFn);
    const { result } = renderHook(() => useAtom(atom));
    expect(atom.value).toBe(initialFn);
    expect(result.current[0]).toBe(initialFn);
    expect(mock).toHaveBeenCalledTimes(0);
    const nextFn = () => {
      mock();
      return 'next';
    };
    act(() => {
      result.current[1]((previousFn) => {
        expect(previousFn()).toBe('initial');
        return nextFn;
      });
    });
    expect(mock).toHaveBeenCalledTimes(1);
    expect(atom.value).toBe(nextFn);
    expect(result.current[0]).toBe(nextFn);
  });

  test('Does not cause unnecessary re-renders', () => {
    const onRenderMock = jest.fn();
    const atom = createAtom<string>('value');
    const ComponentWithAtom: React.FC = () => {
      const [value] = useAtom(atom);
      onRenderMock();
      return <div>{value}</div>;
    };
    render(<ComponentWithAtom />);
    expect(onRenderMock).toHaveBeenCalledTimes(1);
  });

  test('Does not cause unnecessary re-renders on atom update', () => {
    const onRenderMock = jest.fn();
    const onUseEffectMock = jest.fn();
    const atom = createAtom<string>('value');
    const ComponentWithAtom: React.FC = () => {
      const [value, setValue] = useAtom(atom);
      expectTypeOf(value).toMatchTypeOf<string>();
      expectTypeOf(setValue).toMatchTypeOf<(value: SetAtomValue<string>) => void>();
      onRenderMock();
      useEffect(() => {
        onUseEffectMock();
        setValue('next');
      }, [setValue]);
      return <div>{value}</div>;
    };
    render(<ComponentWithAtom />);
    expect(onRenderMock).toHaveBeenCalledTimes(2);
    expect(onUseEffectMock).toHaveBeenCalledTimes(1);
  });

  test('Setter returns correct current value in callback after atom update', () => {
    const atom = createAtom<number>(1);
    const { result } = renderHook(() => useAtom(atom));
    act(() => {
      result.current[1]((currentValue) => currentValue + 1);
      result.current[1]((currentValue) => currentValue + 1);
    });
    expect(result.current[0]).toBe(3);
  });
});
