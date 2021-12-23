
# Simple Atom 

Simple atomic state that can be updated outside React.

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://choosealicense.com/licenses/mit/)

## Why `simple-atom`?
 
* Update state **outside of a React component.**

* No need for React Context, store your atoms in **global scope**.

* **Familiar API**, identical to `React.setState`.

* First class **Typescript support**.

* It's simple, open source and it's tiny! **<250 bytes** gzipped.


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
        return (
            <h1>You are logged out</h1>
        );
    }

    return (
        <button onClick={() => setUser(null)}>
            Logout
        </button>
    );
}

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

const darkModeAtom = createAtom(window.localStorage.getItem('dark-mode') === 'true');

// Add a subscriber that is triggered on atom value change
darkModeAtom.subscribe((value) => {
    window.localStorage.setItem('dark-mode', value.toString());
});

const MyComponent = () => {
    const [darkMode, setDarkMode] = useAtom(darkModeAtom);

    return (
        <button onClick={() => setDarkMode(!darkMode)}>
            Toggle dark mode
        </button>
    );
}

```

#### With Typescript
```typescript
import { createAtom } from 'simple-atom';

type User = { name: string, age: number } | null;

const userAtom = createAtom<User>({ name: 'James', age: 25 });

```

## Acknowledgements
This package was inspired by these projects.

 - [React](https://reactjs.org/docs/hooks-reference.html#usestate)
 - [Jotai](https://github.com/pmndrs/jotai)
 - [Recoil](https://recoiljs.org/)
 - [Zustand](https://github.com/pmndrs/zustand)


## Authors

- [James Berry (@jlalmes)](https://twitter.com/@jlalmes)

Contributions are always welcome! 🙌
