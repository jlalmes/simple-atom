<div align="center">
  <h1>simple-atom</h1>
  <p>If Jotai & Zustand had a baby 👼</p>
  <a href="https://www.npmjs.com/package/simple-atom"><img src="https://img.shields.io/npm/v/simple-atom.svg?style=flat&color=brightgreen" target="_blank" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-black" /></a>
  <br />
  <hr />
</div>

Simple atomic state that can be updated outside of the React life-cycle.

## Why use `simple-atom`?

- Update state **outside of a React component.**

- No need for React Context, store your atoms in **global scope**.

- **Familiar API**, identical usage to `React.setState`.

- First class **Typescript support**.

- It's simple, open source and it's tiny! **<250 bytes** gzipped.

## Installation

```bash
  npm install simple-atom
```

Please ensure you have installed [`react`](https://github.com/facebook/react) at version `v16.8.0` or higher.

## Examples

#### Basic usage

```javascript
import React from 'react';
// Import 'simple-atom'
import { createAtom, useAtom } from 'simple-atom';

// Create an atom with 'createAtom'
const userAtom = createAtom({ name: 'James', age: 25 });

const MyComponent = () => {
  // Get current value and setter function with 'useAtom' hook
  const [user, setUser] = useAtom(userAtom);

  if (!user) {
    return <h1>You are logged out</h1>;
  }

  return <button onClick={() => setUser(null)}>Logout</button>;
};
```

#### Update component state outside of React

```javascript
// == MyComponent.jsx ==
import React from 'react';
import { createAtom, useAtom } from 'simple-atom';

export const isLoadingAtom = createAtom(false);

const MyComponent = () => {
    const [isLoading] = useAtom(isLoadingAtom);

    if (isLoading) {
        return (
            <div>Loading, please wait...</div>
        );
    }

    return (
        // ...
    );
}

// == other-application-file.js ==
import { isLoadingAtom } from './MyComponent.jsx';

// MyComponent will now re-render with the updated isLoading state
isLoadingAtom.value = true;

```

#### Subscribe to state changes

```javascript
import React from 'react';
import { createAtom, useAtom } from 'simple-atom';

const darkModeAtom = createAtom(() => {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.localStorage.getItem('dark-mode') === 'true';
});

// Add a subscriber that is triggered on atom value change
darkModeAtom.subscribe((value) => {
  window.localStorage.setItem('dark-mode', value.toString());
});

const MyComponent = () => {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);

  return <button onClick={() => setDarkMode(!darkMode)}>Toggle dark mode</button>;
};
```

#### With Typescript

```typescript
import { createAtom } from 'simple-atom';

type User = { name: string; age: number } | null;

const userAtom = createAtom<User>({ name: 'James', age: 25 });
```

## Acknowledgements

This package was inspired by these projects.

- [React](https://reactjs.org/docs/hooks-reference.html#usestate)
- [Jotai](https://github.com/pmndrs/jotai)
- [Zustand](https://github.com/pmndrs/zustand)

## Authors

- [James Berry (@jlalmes)](https://twitter.com/@jlalmes)

Contributions & PRs are always welcome! 🙌
