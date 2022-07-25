import { render } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';
import React, { useEffect } from 'react';

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
    const initialFunction = jest.fn(() => ({}));
    const atom = createAtom<() => void>(() => initialFunction);
    const { result } = renderHook(() => useAtom(atom));
    expect(atom.value).toBe(initialFunction);
    expect(result.current[0]).toBe(initialFunction);
    expect(initialFunction).toBeCalledTimes(0);
    const updatedFunction = jest.fn(() => ({}));
    act(() => {
      result.current[1](() => updatedFunction);
    });
    expect(atom.value).toBe(updatedFunction);
    expect(result.current[0]).toBe(updatedFunction);
    expect(updatedFunction).toBeCalledTimes(0);
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
