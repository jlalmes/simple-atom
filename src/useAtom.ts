import { useState, useEffect } from 'react';
import type { SetStateAction } from 'react';

import type { Atom } from './Atom';

/** React hook that returns the stateful value of an atom and a function to update it  */
export const useAtom = <T>(atom: Atom<T>): [typeof state, typeof setValue] => {
  const [state, setState] = useState<T>(atom.value);

  useEffect(() => {
    if (state !== atom.value) setState(() => atom.value);
    const unsubscribe = atom.subscribe((value) => setState(() => value));
    return unsubscribe;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [atom]);

  const setValue = (value: SetStateAction<T extends Function ? () => T : T>) => {
    // @ts-ignore ts(2349)
    // eslint-disable-next-line no-param-reassign
    atom.value = typeof value === 'function' ? value(atom.value) : value;
  };

  return [state, setValue];
};
