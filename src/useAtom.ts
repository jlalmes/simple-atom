import { useCallback, useEffect, useState } from 'react';

import type { Atom } from './Atom';

export type SetAtomValue<T> = (T extends Function ? never : T) | ((prevState: T) => T);

/** React hook returns a tuple of reactive atom value and setter function  */
export const useAtom = <T>(atom: Atom<T>): [typeof state, typeof setValue] => {
  const [state, setState] = useState<T>(() => atom.value);

  useEffect(() => {
    if (state !== atom.value) {
      setState(() => atom.value);
    }
    const unsubscribe = atom.subscribe((value) => setState(() => value));
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atom]);

  const setValue = useCallback(
    (value: SetAtomValue<T>) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      atom.value = typeof value === 'function' ? (value as Function)(atom.value) : value;
    },
    [atom],
  );

  return [state, setValue];
};
