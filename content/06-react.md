# React

React is a JavaScript library for building user interfaces out of **components**: self-contained, reusable pieces that describe a part of the screen. Its model is **declarative**, you describe what the UI should look like for a given state, and React keeps the actual DOM in sync as that state changes. This guide runs foundational to advanced: what React is, JSX, components, props, state and hooks, patterns, context, performance, styling, routing, and testing. It assumes the JavaScript and async/HTTP notes as background.

## Notes

### What React is

- React builds UIs from **components**, composed together into a tree
- it is **declarative**: you describe the UI for the current state, React figures out the DOM changes (you rarely touch the DOM directly)
- the **Virtual DOM** is React's in-memory representation of the UI; on a change, React diffs the new virtual tree against the old (**reconciliation**) and updates only the real DOM nodes that changed, which is faster than re-rendering everything
- a React app **mounts** into one root DOM node:
  ```js
  import { createRoot } from 'react-dom/client';
  const root = createRoot(document.getElementById('root'));
  root.render(<App />);
  ```
- everything else (components, state, effects) hangs off that single rendered tree

> **Beyond the cheatsheets**
> - React is a **library**, not a full framework; for routing, data fetching, etc. you add packages (or use a framework like Next.js built on React) ([react.dev](https://react.dev/learn))
> - the mental model that pays off most: **UI is a function of state**. Given the same state, a component renders the same output ([react.dev: thinking in React](https://react.dev/learn/thinking-in-react))

### JSX

- **JSX** is a syntax extension that lets you write HTML-like markup inside JavaScript; it compiles to `React.createElement()` calls (via a build tool), so a browser never sees JSX directly
- rules and idioms:
  - a JSX expression must have **one outermost element** (wrap siblings in a parent or a fragment `<>...</>`)
  - multiline JSX is wrapped in parentheses `( ... )`
  - embed any JavaScript **expression** in curly braces: `{count * 2}`, `{user.name}`
  - use **`className`** instead of `class` (class is reserved in JS); attributes otherwise resemble HTML
  - empty elements must self-close: `<br />`, `<img />`
- **conditionals** (JSX has no `if` inside it): a ternary `{cond ? a : b}`, the `&&` operator `{cond && <X />}`, or an `if` statement outside the JSX
- **lists**: `.map()` an array to JSX elements, giving each a unique **`key`** prop so React can track items across renders

> **Beyond the cheatsheets**
> - `key` should be a stable unique id from your data, not the array index, since index keys cause bugs when the list reorders or items are inserted/removed ([react.dev](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key))
> - a **fragment** (`<>...</>`) groups children without adding a wrapper DOM node ([react.dev](https://react.dev/reference/react/Fragment))

### Components

- a **component** is a function that returns JSX; it describes a reusable piece of UI
- **component names must be capitalized** so JSX can tell a component (`<Profile />`) from an HTML tag (`<div>`)
- a component must `return` JSX (or `null`); it can run plain JavaScript before the `return` to prepare values
- one component per file is typical; **export** it and **import** where needed
- components **compose**: a component's JSX can include other components, building the tree
  ```js
  function Greeting() {
    return <h1>Hello!</h1>;
  }
  function App() {
    return (
      <div>
        <Greeting />
        <Greeting />
      </div>
    );
  }
  ```

> **Beyond the cheatsheets**
> - components must be **pure**: same inputs (props/state) produce the same JSX, with no side effects during render (those belong in effects or event handlers) ([react.dev](https://react.dev/learn/keeping-components-pure))
> - older React code uses **class components** (`class X extends React.Component`, a `render()` method, `this.state`); they still work, but function components with hooks are the modern default and the rest of these notes use them ([react.dev](https://react.dev/reference/react/Component))

### Props

- **props** pass data from a parent component to a child, as attributes on the JSX tag
- the child receives a single **`props` object** as its parameter (often destructured)
  ```js
  function Welcome({ name }) {
    return <h1>Hello, {name}!</h1>;
  }
  // used as: <Welcome name="Carlo" />
  ```
- **`props.children`**: whatever sits between a component's opening and closing tags is available as `props.children`
- **default values**: give a destructured prop a default (`function X({ size = 'md' })`) for when the parent omits it
- props are **read-only**: a component must never modify its own props; only the parent can change what it passes
- **props vs state**: props are passed in from outside and are fixed from the component's view; state is owned and updated by the component itself

> **Beyond the cheatsheets**
> - older code validates props at runtime with **`propTypes`** (and `defaultProps`); new projects get this from **TypeScript** types instead (see the TypeScript notes) ([react.dev](https://react.dev/reference/react/Component#static-proptypes))
> - the **spread** operator forwards many props at once: `<Profile {...user} />` ([react.dev](https://react.dev/learn/passing-props-to-a-component#forwarding-props-with-the-jsx-spread-syntax))

### State & the useState hook

- **state** is data a component owns and can change over time; changing it re-renders the component
- **hooks** are functions (named `use...`) that let function components tap into React features like state and lifecycle
- **`useState`** adds a state variable; it returns a pair: the current value and a setter
  ```js
  import { useState } from 'react';
  function Counter() {
    const [count, setCount] = useState(0); // 0 is the initial value
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
  }
  ```
- calling the **setter** updates the value and triggers a re-render; the component function runs again with the new value
- **never mutate state directly**; create a new value. For arrays/objects, build a new copy (often with spread):
  ```js
  setItems([...items, newItem]);          // add to array
  setUser({ ...user, name: 'New Name' }); // update object field
  ```
- use the **functional update** form when the next value depends on the previous: `setCount(prev => prev + 1)`
- a component can call `useState` multiple times for separate pieces of state

> **Beyond the cheatsheets**
> - state updates are **asynchronous and batched**; reading the state variable right after calling its setter still shows the old value until the next render ([react.dev](https://react.dev/reference/react/useState#ive-updated-the-state-but-the-screen-doesnt-update))
> - for complex state with many sub-values or transitions, **`useReducer`** centralizes update logic in a reducer function, a pattern that scales toward Redux (see the Redux notes) ([react.dev](https://react.dev/reference/react/useReducer))
> - **`useRef`** holds a mutable value that persists across renders without triggering re-renders, commonly to reference a DOM node ([react.dev](https://react.dev/reference/react/useRef))

### The useEffect hook

- **`useEffect`** runs **side effects** after render: work outside the render-pure world such as fetching data, subscriptions, timers, logging, or manual DOM interaction
- signature: `useEffect(callback, dependencies)`; the callback holds the effect logic
- the **dependency array** controls when the effect runs:
  - **omitted**: runs after every render
  - **empty `[]`**: runs once, after the first render
  - **populated `[a, b]`**: runs after the first render and again whenever any listed value changes
  ```js
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]); // re-runs only when count changes
  ```
- the callback may **return a cleanup function**, which React runs before re-running the effect and when the component unmounts (to cancel timers, unsubscribe, abort requests, etc.)

> **Beyond the cheatsheets**
> - effects are for **synchronizing with external systems**, not for transforming data during render; if you can compute a value from existing props/state, do it in the body, not an effect ([react.dev: you might not need an effect](https://react.dev/learn/you-might-not-need-an-effect))
> - missing dependencies cause stale-value bugs; the `eslint-plugin-react-hooks` rule flags them ([react.dev](https://react.dev/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means))
> - for data fetching specifically, raw effects get verbose fast; libraries like TanStack Query are usually better (see the async/HTTP notes)

### Events & forms

- **event handlers** are passed as props in JSX, named in camelCase (`onClick`, `onChange`, `onSubmit`); the value is a function, not a call
  ```js
  <button onClick={handleClick}>Save</button>          // reference, runs on click
  <button onClick={() => setCount(count + 1)}>+</button> // inline arrow
  ```
- handlers can take the **event object**: `(event) => { ... }`, with `event.target.value` reading an input's value
- a **controlled component** ties a form input's value to state: the input shows `value={state}` and updates via `onChange`, making React the single source of truth
  ```js
  const [name, setName] = useState('');
  <input value={name} onChange={(e) => setName(e.target.value)} />
  ```

> **Beyond the cheatsheets**
> - React event names are camelCase and pass a cross-browser **SyntheticEvent**; call `event.preventDefault()` to stop a form's default page reload ([react.dev](https://react.dev/reference/react-dom/components/common#react-event-object))
> - React 19 adds form **actions** (passing a function to a `<form action={...}>`) plus `useActionState` and `useFormStatus` for handling submission and pending states ([react.dev](https://react.dev/reference/react-dom/components/form))

### Component patterns & data flow

- **stateful vs stateless**: a stateful component holds state; a stateless one just renders from its props. Both can use props
- **one-way data flow**: data moves down the tree via props; a child cannot change a parent's data directly
- to share state between components, **lift it up** to their lowest common ancestor, then pass the value down to one child and a setter down to another
  ```js
  function Parent() {
    const [value, setValue] = useState('');
    return (
      <>
        <Display value={value} />
        <Input onChange={setValue} />
      </>
    );
  }
  ```
- passing a parent's setter function down as a prop lets a child request a state change (the parent still owns the state)
- the **container / presentational** split: container components hold state and logic, presentational components just receive props and render, which keeps the latter simple and reusable

> **Beyond the cheatsheets**
> - when state needs to live near the top and reach deep children, prop-passing through every level (prop drilling) gets painful; that is what Context and state libraries solve (next sections, and the Redux notes) ([react.dev](https://react.dev/learn/sharing-state-between-components))

### The Context API

- **Context** shares a value with an entire subtree without passing it through every intermediate component as props (it solves **prop drilling**)
- create a context, provide a value, consume it where needed:
  ```js
  import { createContext, useContext } from 'react';
  const ThemeContext = createContext();

  function App() {
    return (
      <ThemeContext.Provider value="dark">
        <Page />
      </ThemeContext.Provider>
    );
  }

  function Page() {
    const theme = useContext(ThemeContext); // "dark", no props needed
    return <div className={theme}>...</div>;
  }
  ```
- the **`.Provider`** wraps a subtree and supplies its `value`; any descendant reads it with **`useContext`**
- the value can include state and its setter (`value={{ count, setCount }}`) so descendants can update it; providers can be nested, with the nearest one winning

> **Beyond the cheatsheets**
> - Context is for **low-frequency, widely-needed** data (theme, current user, locale); for high-frequency updates or large app state, a dedicated library is better since every consumer re-renders on value change ([react.dev](https://react.dev/learn/passing-data-deeply-with-context#before-you-use-context))
> - **`useContext` + `useReducer`** together make a lightweight Redux-style store without extra dependencies ([react.dev](https://react.dev/learn/scaling-up-with-reducer-and-context))

### Custom hooks

- a **custom hook** is a function whose name starts with `use` and that calls other hooks; it extracts and **reuses stateful logic** across components
- it can return anything: a value, a state-and-updater pair, an object of helpers
  ```js
  function useTheme() {
    const [theme, setTheme] = useState('light');
    useEffect(() => {
      document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);
    const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
    return { theme, toggle };
  }
  ```
- the **rules of hooks** apply to all hooks, built-in and custom:
  - only call hooks at the **top level** (not inside loops, conditions, or nested functions), so they run in the same order every render
  - only call hooks from **React function components or other hooks**
- benefits: abstracts and hides complex logic, and lets multiple components share the same stateful behavior

> **Beyond the cheatsheets**
> - custom hooks share *logic*, not *state*: each component calling a hook gets its own independent state ([react.dev](https://react.dev/learn/reusing-logic-with-custom-hooks#custom-hooks-let-you-share-stateful-logic-not-state-itself))

### Performance & optimization

- React re-renders a component when its state or props change, cascading to its children; usually fine, but expensive trees can be optimized
- **memoization** avoids redundant work by caching results for the same inputs:
  - **`React.memo(Component)`**: skips re-rendering a component when its props are unchanged
  - **`useMemo(fn, deps)`**: caches a computed **value**, recomputing only when deps change
  - **`useCallback(fn, deps)`**: caches a **function** identity, so it is not recreated each render (useful when passing callbacks to memoized children)
- **code splitting** keeps the initial bundle small by loading parts on demand:
  - **`React.lazy(() => import('./X'))`** loads a component as a separate chunk
  - wrap lazy components in **`<Suspense fallback={...}>`** to show a loading state while the chunk downloads
- the **React Profiler** (browser devtools extension) records renders and shows a flame graph of what took time
- **error boundaries** catch render-time errors in their subtree and show fallback UI instead of crashing the app; they remain one of the few things that require a class component (`componentDidCatch` / `getDerivedStateFromError`)

> **Beyond the cheatsheets**
> - optimize only when you measure a real problem; premature `useMemo`/`useCallback` adds complexity for no gain. Profile first ([react.dev](https://react.dev/reference/react/useMemo#should-you-add-usememo-everywhere))
> - the **React Compiler** (rolling out with recent React) auto-memoizes, aiming to make most manual `memo`/`useMemo`/`useCallback` unnecessary ([react.dev](https://react.dev/learn/react-compiler))

### Styling

- **inline styles**: pass an object to the `style` prop, with camelCased property names; numbers are treated as `px`
  ```js
  <h1 style={{ color: 'blue', fontSize: 24, marginTop: '1rem' }}>Hi</h1>
  ```
  (the double braces are one for JSX-embedding, one for the object literal)
- **CSS Modules**: write styles in a `.module.css` file and import them; class names are transformed into unique identifiers at build time, scoping styles to the component and preventing name collisions
  ```js
  import styles from './Button.module.css';
  <button className={styles.primary}>Click</button>
  ```

> **Beyond the cheatsheets**
> - inline styles suit dynamic, conditional values but cannot do pseudo-classes, media queries, or keyframes; CSS Modules or a CSS-in-JS library handle those ([react.dev](https://react.dev/reference/react-dom/components/common#applying-css-styles))
> - the broader styling landscape (Tailwind, styled-components, and other CSS-in-JS) is covered in the CSS notes; Tailwind is the common default in current React projects

### Routing with React Router

- a **single-page application (SPA)** loads once and swaps views client-side; **React Router** maps URL paths to components so navigation happens without full page reloads
- it lives in the `react-router-dom` package; wrap the app in a router, then declare routes:
  ```js
  import { BrowserRouter, Routes, Route } from 'react-router-dom';
  function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users/:userId" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    );
  }
  ```
- **dynamic segments** (`:userId`) match any value; read them with the **`useParams`** hook: `const { userId } = useParams()`
- **navigation**:
  - **`<Link to="/path">`** renders an anchor but navigates client-side (no reload); **`<NavLink>`** adds active-state styling
  - **`useNavigate()`** navigates imperatively (e.g. after a form submit): `navigate('/success')`
  - **`<Navigate to="/login" />`** redirects declaratively when rendered
- **nested routes** render child routes inside a parent layout via an **`<Outlet />`**; a wildcard `*` route catches unmatched URLs for a 404

> **Beyond the cheatsheets**
> - React Router's API has shifted across major versions (v5 used `<Switch>`, `component={}`, `exact`; v6+ uses `<Routes>`, `element={}`, and always-exact matching), so check which version a tutorial targets ([reactrouter.com](https://reactrouter.com/))
> - recent versions add data routers (`createBrowserRouter`, loaders, and actions) that fetch data per route ([reactrouter.com](https://reactrouter.com/start/data/route-object))

### Testing

- React testing typically pairs two tools: **Jest** (the test runner and assertion library) and **React Testing Library (RTL)** (renders components and queries them like a user would)
- **RTL philosophy**: test behavior from the user's perspective (what is on screen), not implementation details (internal state, prop names)
- core flow:
  ```js
  import { render, screen } from '@testing-library/react';
  import userEvent from '@testing-library/user-event';
  import '@testing-library/jest-dom';

  test('shows greeting after click', async () => {
    render(<App />);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });
  ```
- **`render()`** mounts the component into a test DOM; **`screen`** queries it; **`screen.debug()`** prints the rendered output
- **query variants** differ by what they do when no match is found:
  - **`getBy...`**: returns the node, throws if absent (use when it should exist)
  - **`queryBy...`**: returns `null` if absent (use to assert something is *not* there)
  - **`findBy...`**: returns a promise, retries (use for elements that appear after async work; `await` it)
  - queries select by accessible role/text, e.g. `getByRole`, `getByText`, `getByLabelText`
- **`@testing-library/jest-dom`** adds DOM matchers like `toBeInTheDocument()`, `toBeNull()`, `toHaveTextContent()`
- **`userEvent`** simulates realistic interactions (clicks, typing); **`waitFor()`** waits for an async assertion to pass
- **Jest** also provides `expect()` assertions and mocking: `jest.fn()` for mock functions, `jest.mock()` (with a `__mocks__/` folder) for whole modules

> **Beyond the cheatsheets**
> - Codecademy uses Jest, but **Vitest** is the common runner in Vite projects; the RTL API is identical, so tests look the same (see the testing section of the JavaScript notes) ([vitest.dev](https://vitest.dev/), [testing-library.com](https://testing-library.com/docs/react-testing-library/intro/))
> - prefer role-based queries (`getByRole`) for accessibility and resilience; `getByTestId` is a last resort ([testing-library.com](https://testing-library.com/docs/queries/about/#priority))

### Ecosystem & tooling

> Background on the surrounding landscape. The deep dives live in sibling notes; this is the map.

- **project setup**: **Vite** is the current default for new React apps (fast dev server and build); `create-react-app` is deprecated and no longer recommended
- **frameworks on top of React**: **Next.js** (server rendering, routing, full-stack), Remix, and others add structure React leaves out; useful once an app outgrows a pure SPA
- **state management**: local state (`useState`/`useReducer`) and Context cover a lot; for larger shared state, **Redux Toolkit** is the common choice (its own notes), with alternatives like Zustand and Jotai
- **data fetching / server state**: **TanStack Query**, SWR, and **RTK Query** handle caching, refetching, and loading/error states far better than raw effects (see the async/HTTP and Redux notes)
- **types**: **TypeScript** is standard in modern React, replacing `propTypes` with compile-time prop checking (see the TypeScript notes)
- pointers to sibling files: **promises / fetch / data fetching** (async-http notes), **Redux and RTK Query** (Redux notes), **TypeScript with React** (TypeScript notes), **styling libraries** (CSS notes)

## Cheatsheet links

37. [Learn React: Introduction](https://www.codecademy.com/learn/learn-react-introduction/modules/react-101-jsx-u/cheatsheet) / duplicate: [Learn React](https://www.codecademy.com/learn/react-101/modules/react-101-jsx-u/cheatsheet) / duplicate: [Create a Front-End App with React - Introduction to React](https://www.codecademy.com/learn/bwa-intro-to-react/modules/react-101-jsx-u/cheatsheet)
38. [Create a Front-End App with React - Introduction to JavaScript and Building Apps](https://www.codecademy.com/learn/intro-to-building-web-apps-with-React/modules/overview-of-react/cheatsheet)
39. [Create a Front-End App with React - React: Component State](https://www.codecademy.com/learn/react-component-state/modules/react-hooks-u/cheatsheet)
40. [Learn React: Hooks](https://www.codecademy.com/learn/learn-react-hooks/modules/learn-react-hooks/cheatsheet)
41. [Learn React: State Management](https://www.codecademy.com/learn/learn-react-state-management/modules/learn-react-stateless-inherit-stateful/cheatsheet)
42. [Create a Front-End App with React - React: Components Interacting](https://www.codecademy.com/learn/react-components-interacting/modules/components-and-props/cheatsheet)
43. [Learn React.js: Part II](https://www.codecademy.com/learn/react-102/modules/react-programming-patterns/cheatsheet)
44. [Learn Advanced React](https://www.codecademy.com/learn/learn-advanced-react/modules/advanced-react-custom-hooks/cheatsheet)
45. [Learn React: Additional Basics](https://www.codecademy.com/learn/learn-react-additional-basics/modules/react-styles/cheatsheet)
46. [Learn React Router v6](https://www.codecademy.com/learn/learn-react-router/modules/learn-react-router/cheatsheet)
47. [Learn React Testing](https://www.codecademy.com/learn/learn-react-testing/modules/jest/cheatsheet)
