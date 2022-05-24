import { useCallback, useEffect, useState } from 'react';

import type { Atom, DeepReadonly } from './Atom';

// eslint-disable-next-line @typescript-eslint/ban-types
export type SetAtomValue<T> = T extends Function ? (prevState: T) => T : T | ((prevState: T) => T);

/** React hook that returns a tuple with reactive atom value and update function  */
export const useAtom = <T>(atom: Atom<T>): [typeof state, typeof setValue] => {
  const [state, setState] = useState<DeepReadonly<T>>(() => atom.value);

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
      atom.value = typeof value === 'function' ? value(atom.value) : value;
    },
    [atom],
  );

  return [state, setValue];
};
