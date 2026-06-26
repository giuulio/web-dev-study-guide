# Redux

Redux is a library for managing **global application state**: data that many components across an app need to read and update. It keeps that state in a single centralized **store**, and enforces that the only way to change it is by dispatching plain **action** objects, which **reducer** functions turn into the next state. That discipline makes state changes predictable, traceable, and debuggable. This guide teaches the core model (which is worth understanding), then **Redux Toolkit (RTK)**, which is how Redux is actually written today. It assumes the React and async/HTTP notes as background.

## Notes

### What Redux is & core concepts

- Redux solves the problem of **shared state**: when data is needed by many components, passing it through props (prop drilling) or scattering it across components gets unmanageable
- it shines for apps with a lot of **global state accessed by many components**; smaller apps often do fine with React's own tools (see the ecosystem section)
- **three core pieces**:
  - **store**: a single object holding all global state, the **single source of truth**
  - **action**: a plain object describing *what happened*; must have a `type` string, often carries a `payload` with data
    ```js
    { type: 'todos/addTodo', payload: 'Buy milk' }
    ```
  - **reducer**: a pure function `(state, action) => newState` that calculates the next state from the current state and an action
- **one-way data flow**: store → view → action → store
  - the view reads state from the store and renders
  - a user interaction dispatches an action
  - the reducer produces new state, the store updates, subscribed views re-render
- **reducer rules** (what keeps Redux predictable):
  - never mutate state; return a new value
  - no side effects (no network requests, no random numbers, no async) inside reducers
  - depend only on the `(state, action)` arguments
- an **action creator** is a function that returns an action object, for consistency and reuse

> **Beyond the cheatsheets**
> - the predictability has a concrete payoff: because state changes are just actions applied to reducers, the **Redux DevTools** let you inspect every action, see state before/after, and even time-travel through them ([redux.js.org](https://redux.js.org/usage/configuring-your-store#example-logging-middleware))
> - the rules above describe **classic Redux**; Redux Toolkit (later sections) relaxes the "no mutation" rule in your code by using Immer under the hood, while keeping the actual updates immutable

### The Redux store API

> This is the underlying model that Redux Toolkit wraps. You will rarely write it by hand in a new app, but understanding it explains what RTK does for you.

- `createStore(reducer)`: creates the store from a root reducer (classic API)
- the store exposes three methods:
  - **`getState()`**: returns the current state tree (the only way the view reads state; do not mutate the result)
  - **`dispatch(action)`**: the only way to trigger a state change; runs the reducer with the current state and the action
  - **`subscribe(listener)`**: registers a callback that runs on every state change; returns a function to unsubscribe
- a **slice** is the portion of state and logic for one feature (e.g. all todos state + its reducers), usually grouped in one file
- **`combineReducers({ ... })`**: takes an object of slice reducers and returns one **root reducer**; each key becomes a top-level slice of state, and the root reducer routes each action to every slice reducer

> **Beyond the cheatsheets**
> - `createStore` is now **deprecated** in favor of Redux Toolkit's `configureStore` (the official docs recommend never setting up a store by hand anymore). The model above still describes what is happening internally ([redux.js.org](https://redux.js.org/api/createstore))

### Connecting Redux to React

- Redux is UI-agnostic; the **`react-redux`** package is the official binding that connects a store to React components
- **`<Provider store={store}>`**: wraps the app (or a subtree) and makes the store available to every component inside, via React Context, so no prop drilling
  ```js
  import { Provider } from 'react-redux';
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  ```
- **`useSelector(selectorFn)`**: reads a piece of state from the store; it subscribes the component and re-renders it whenever the selected value changes
  ```js
  const todos = useSelector((state) => state.todos);
  ```
- **`useDispatch()`**: returns the store's `dispatch` function so the component can dispatch actions
  ```js
  const dispatch = useDispatch();
  dispatch(addTodo('Buy milk'));
  ```
- a **selector** is a function that extracts a specific piece of state; defining them separately keeps components clean and the logic reusable

> **Beyond the cheatsheets**
> - older code connects components with the **`connect()`** higher-order component and `mapStateToProps` / `mapDispatchToProps`; the `useSelector` / `useDispatch` hooks are the modern, simpler replacement and what you should use ([react-redux.js.org](https://react-redux.js.org/api/hooks))
> - keep `useSelector` returning the **minimal** data a component needs; returning a new object/array each call causes extra re-renders unless memoized (see `createSelector` in the ecosystem section)

### Redux Toolkit

- **Redux Toolkit (RTK)**, the `@reduxjs/toolkit` package, is the official, recommended way to write Redux; it removes most of the boilerplate (manual action types, action creators, hand-written immutable updates, store setup)
- **`configureStore({ ... })`**: sets up the store with good defaults (DevTools, thunk middleware, dev checks) in one call
  ```js
  import { configureStore } from '@reduxjs/toolkit';
  const store = configureStore({
    reducer: {
      todos: todosReducer,
      session: sessionReducer,
    },
  });
  ```
  - when `reducer` is an object of slice reducers, RTK combines them into the root reducer for you (it calls `combineReducers` internally)
- **`createSlice({ ... })`**: the workhorse; defines a slice's name, initial state, and reducers in one place
  ```js
  import { createSlice } from '@reduxjs/toolkit';
  const todosSlice = createSlice({
    name: 'todos',
    initialState: { items: [] },
    reducers: {
      addTodo: (state, action) => {
        state.items.push(action.payload); // looks like mutation, is safe
      },
    },
  });
  ```
  - it uses **Immer** internally, so you write "mutating" logic in case reducers and RTK converts it to a correct immutable update (this avoids the most common Redux bug: accidental mutation)
  - it **auto-generates action creators and action types** from the reducer names; the type is `sliceName/reducerName` (e.g. `todos/addTodo`)
  - it returns `todosSlice.reducer` (the slice reducer) and `todosSlice.actions` (the action creators)
- **file convention** (a slice per feature): export the **action creators as named exports** and the **reducer as the default export**
  ```js
  export const { addTodo } = todosSlice.actions;
  export default todosSlice.reducer;
  ```

> **Beyond the cheatsheets**
> - RTK is not optional-extra knowledge: the Redux team now teaches it as **the** way to use Redux, and recommends against hand-writing the classic patterns in the previous sections ([redux.js.org](https://redux.js.org/introduction/why-rtk-is-redux-today))
> - keeping **synchronous** game/session logic in plain `createSlice` reducers, separate from async logic, is a clean architectural split (async goes through thunks, below)

### Middleware & thunks

- a plain Redux store can only do **synchronous** updates; reducers must stay pure, so async work (API calls) cannot live there
- **middleware** extends the store, sitting between `dispatch` and the reducers; it can intercept, delay, or augment actions, and is where async logic belongs
- a **thunk** is a function that wraps a computation to defer it until needed (the name is a playful past tense of "think"); in Redux, a thunk is a function returned by an action creator instead of a plain action object
- **`redux-thunk`** is the middleware that enables this: when you dispatch a function, it invokes that function (passing `dispatch` and `getState`); when you dispatch a plain object, it passes it straight through to the reducers
  ```js
  // a thunk action creator
  const fetchUser = (id) => {
    return async (dispatch, getState) => {
      const user = await fetchUserApi(id);
      dispatch({ type: 'users/addUser', payload: user });
    };
  };
  ```
- this lets a single dispatched thunk perform async work and then dispatch normal synchronous actions with the results

> **Beyond the cheatsheets**
> - you rarely set up `redux-thunk` yourself now: `configureStore` includes the thunk middleware **by default**, and `createAsyncThunk` (next section) generates thunks for you ([redux-toolkit.js.org](https://redux-toolkit.js.org/api/getDefaultMiddleware))

### Async logic with createAsyncThunk

- **`createAsyncThunk(typePrefix, payloadCreator)`**: RTK's standard tool for async flows; it generates a thunk plus three action types for the request lifecycle
  ```js
  import { createAsyncThunk } from '@reduxjs/toolkit';
  export const fetchTodos = createAsyncThunk(
    'todos/fetchTodos',          // action type prefix
    async (arg, thunkAPI) => {   // payload creator, returns a promise
      const response = await client.get('/api/todos');
      return response.todos;     // becomes action.payload on success
    }
  );
  ```
  - the **payload creator** gets your argument (`arg`, use an object if you need several values) and a **`thunkAPI`** object (with `dispatch`, `getState`, and more)
  - dispatching the thunk runs the promise and auto-dispatches lifecycle actions: **`pending`** (started), **`fulfilled`** (resolved), **`rejected`** (errored)
- handle those lifecycle actions in the slice's **`extraReducers`**, which lets a slice respond to action types it did not itself define
  ```js
  const todosSlice = createSlice({
    name: 'todos',
    initialState: { items: [], status: 'idle' },
    reducers: { /* sync reducers */ },
    extraReducers: (builder) => {
      builder
        .addCase(fetchTodos.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchTodos.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.items = action.payload;
        })
        .addCase(fetchTodos.rejected, (state) => {
          state.status = 'failed';
        });
    },
  });
  ```
  - `extraReducers` also uses Immer, so mutation-style updates are safe here too
- a `status` field (`'idle' | 'loading' | 'succeeded' | 'failed'`) is the conventional way to model the request lifecycle, so the UI can show loading and error states

> **Beyond the cheatsheets**
> - the Codecademy sheet writes `extraReducers` as an **object map** (`{ [fetchTodos.pending]: ... }`); that form was **removed in RTK 2.0**. Use the **builder callback** form shown above (`(builder) => builder.addCase(...)`) ([redux-toolkit.js.org](https://redux-toolkit.js.org/api/createSlice#the-extrareducers-builder-callback-notation))
> - this lifecycle (idle/loading/succeeded/failed) is the same illegal-states-made-unrepresentable idea as a load-state enum: one status field beats scattered boolean flags

### Ecosystem & tooling

> Background on where Redux sits today. The deep dives live in sibling notes; this is the map.

- **is Redux still used?** Yes, but its role has narrowed. It remains common in large apps with complex, widely-shared state, and **Redux Toolkit** is now the standard (classic hand-written Redux is legacy). Plenty of apps that once reached for Redux by default now use lighter options
- **lighter alternatives**:
  - **Zustand**: a small, hook-based store with minimal boilerplate; very popular for new projects that want global state without Redux's structure
  - **Jotai** and **Recoil**: atom-based state, good for fine-grained reactive state
  - React's own **`useContext` + `useReducer`** covers a lot of shared-state needs with no dependencies (see the React notes)
- **RTK Query**: RTK's built-in data-fetching and caching layer; for *server* state (API data), it often replaces hand-written thunks entirely, handling caching, refetching, and loading/error states (relates closely to the async/HTTP notes)
- **`createSelector`** (from RTK, re-exported from the Reselect library): builds **memoized** selectors that only recompute when their inputs change, avoiding needless work and re-renders for derived data
- **Redux DevTools**: browser extension for inspecting dispatched actions and state over time; enabled by default with `configureStore`
- **choosing**: reach for local component state first, then Context / `useReducer`, then a global library (RTK or Zustand) when shared state genuinely grows complex; for server data specifically, a query library (RTK Query, or TanStack Query from the async notes) is usually the better tool
- pointers to sibling files: **promises / fetch / server state** (async-http notes), **Context, `useReducer`, and when you do not need Redux** (React notes)

## Cheatsheet links

48. [Learn Redux](https://www.codecademy.com/learn/learn-redux/modules/core-concepts-in-redux/cheatsheet) / duplicate: [Learn Redux: Fundamentals](https://www.codecademy.com/learn/learn-redux-fundamentals/modules/core-concepts-in-redux/cheatsheet)
49. [Learn Redux: Middleware and Thunks](https://www.codecademy.com/learn/learn-redux-middleware-and-thunks/modules/learn-redux-middleware-and-thunks/cheatsheet)
50. [Learn Redux: Redux Toolkit](https://www.codecademy.com/learn/learn-redux-redux-toolkit/modules/redux-redux-toolkit/cheatsheet)
