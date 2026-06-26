# Async JavaScript & HTTP

JavaScript is single-threaded: it runs one thing at a time. If it waited synchronously for slow work (network requests, timers, file reads), the whole page would freeze. **Asynchronous** JavaScript solves this: slow operations run in the background and their results are handled later, while the rest of the code keeps running. This guide builds from the concept (the event loop) up through the tools (promises, async/await) to their main use: fetching data from APIs over HTTP. It is the natural sequel to the core JavaScript notes, which deliberately left async out.

## Notes

### Asynchronous JavaScript

- **synchronous** code runs top to bottom, each line blocking until it finishes; **asynchronous** code starts slow work and moves on, handling the result when it is ready
- JavaScript is **single-threaded** and **non-blocking**: it does not sit and wait on slow operations (network, timers, disk), it defers them
- `setTimeout(callback, ms)` is the classic example: it schedules `callback` to run after a delay, without blocking the lines after it
  ```js
  console.log('first');
  setTimeout(() => console.log('third'), 1000);
  console.log('second');
  // logs: first, second, third
  ```
- historically, async results were handled with **callbacks** (functions passed in to run later); deeply nested callbacks become "callback hell", hard to read and error-handle, which is what promises were designed to fix

> **Beyond the cheatsheets**
> - **the event loop** is the mechanism behind all of this. The **call stack** runs your synchronous code. Async operations are handed to the browser/Node, and when they finish, their callbacks wait in a **queue**. The event loop moves queued callbacks onto the stack only when the stack is empty. This is why `setTimeout(fn, 0)` still runs after your current synchronous code ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop), [visual explainer](http://latentflip.com/loupe/))
> - promise callbacks (microtasks) actually have priority over `setTimeout` callbacks (macrotasks); a queued promise resolves before a 0ms timeout ([Jake Archibald](https://jakearchibald.com/2015/tasks-microtasks-queues-and-loops/))

### Promises

- a **`Promise`** is an object representing the eventual result of an asynchronous operation, when that result is not available yet
- **three states**:
  - `pending`: the initial state, operation not finished
  - `resolved` (fulfilled): completed successfully, has a value
  - `rejected`: failed, has an error reason
- once settled (resolved or rejected), a promise's state is final
- **creating** a promise: pass the constructor an **executor function** that receives `resolve` and `reject`:
  ```js
  const promise = new Promise((resolve, reject) => {
    if (success) resolve('value');
    else reject(Error('reason'));
  });
  ```
- **consuming** a promise:
  - `.then(onResolved, onRejected)`: handlers for success and (optionally) failure
  - `.catch(onRejected)`: cleaner way to handle rejection, equivalent to `.then(null, fn)`
- **chaining / composition**: `.then()` returns a new promise, so calls chain; prefer chaining over nesting for readable sequential async steps
  ```js
  promise.then(stepOne).then(stepTwo).then(print);
  ```
- **`Promise.all([...])`**: runs promises in parallel, resolves to an array of all their values once every one resolves; rejects immediately if any single promise rejects

> **Beyond the cheatsheets**
> - related combinators: `Promise.allSettled()` waits for all and reports each outcome (never short-circuits on rejection), `Promise.race()` settles with the first to finish, `Promise.any()` resolves with the first to *succeed* ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#static_methods))
> - always attach a `.catch()` (or use `try/catch` with await); an unhandled rejection is a silent bug ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#error_handling))

### async / await

- **`async`/`await`** (ES2017) is syntactic sugar over promises that reads like synchronous code, much cleaner than long `.then()` chains
- an **`async` function** always returns a promise (any returned value is wrapped in a resolved promise)
- **`await`** pauses the async function until the awaited promise settles, then returns its resolved value; it can only be used inside an `async` function
  ```js
  async function getData() {
    const result = await somePromise();
    console.log(result);
  }
  ```
- works as a function declaration, expression, or arrow function (`async () => { ... }`)
- **error handling** uses ordinary `try...catch`, the same construct as synchronous code, which is a major readability win
  ```js
  async function getData() {
    try {
      const result = await somePromise();
    } catch (error) {
      console.log(error);
    }
  }
  ```
- **concurrency**: starting promises without awaiting them immediately, then awaiting together (or via `Promise.all`), lets independent work run at the same time rather than one after another

> **Beyond the cheatsheets**
> - sequential vs parallel matters for performance: `await a(); await b();` runs them one after the other, while `await Promise.all([a(), b()])` runs them at once. Only serialize when one genuinely depends on the other ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function))
> - top-level `await` works in ES modules, so you can await directly at the top of a module file without wrapping it in an async function ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#top_level_await))

### HTTP & APIs

- **HTTP** is the protocol for requests and responses between a client (browser) and a server; every request has a method, headers, and an optional body, and every response has a status code, headers, and usually a body
- common **request methods** (verbs):
  - `GET`: retrieve data (no body; any parameters go in the URL or query string)
  - `POST`: send new data (payload in the body)
  - also `PUT`/`PATCH` (update) and `DELETE` (remove)
- **status codes** signal the outcome: `2xx` success (200 OK, 201 Created), `3xx` redirect, `4xx` client error (404 Not Found, 401 Unauthorized), `5xx` server error
- an **API** (Application Programming Interface) lets one program use another's functionality or data:
  - **Web APIs** (browser APIs) expose browser capabilities (geolocation, audio, fetch itself)
  - **third-party APIs** provide data or services from an outside company (e.g. OpenWeather for weather, Open Trivia DB for quiz questions)
  - APIs publish documentation describing endpoints, parameters, and auth
- **JSON** (JavaScript Object Notation) is the standard data format APIs return: human-readable key-value text that maps directly onto JS objects and arrays

> **Beyond the cheatsheets**
> - **REST** is the dominant convention for structuring APIs: resources at URLs, HTTP verbs for actions (GET/POST/PUT/DELETE), stateless requests ([MDN glossary](https://developer.mozilla.org/en-US/docs/Glossary/REST))
> - **CORS** (Cross-Origin Resource Sharing) governs which sites a browser lets you fetch from; a server must opt in via headers, a common source of "blocked by CORS" errors ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS))
> - parse and inspect JSON with `JSON.parse()` / `JSON.stringify()`; APIs are explored well with browser devtools or a client like Postman/Insomnia ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON))

### The Fetch API

- **`fetch()`** is the modern browser API for HTTP requests; it returns a promise that resolves to a **response object** (or rejects on network failure)
- **`.json()`** reads the response body and parses it as JSON, itself returning a promise
- **`response.ok`** is `true` for `2xx` statuses; check it before trusting the body
- a **GET** request needs only a URL:
  ```js
  fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(jsonResponse => console.log(jsonResponse));
  ```
- a **POST** (or any customized request) takes an **options object** as the second argument: `method`, `headers`, `body`, `cache`, and more
  ```js
  fetch('https://api.example.com/endpoint', {
    method: 'POST',
    body: JSON.stringify({ id: '200' })
  })
    .then(response => {
      if (response.ok) return response.json();
      throw new Error('Request failed!');
    })
    .then(jsonResponse => console.log(jsonResponse));
  ```
- the same request reads more cleanly with **`async/await`** and `try...catch`:
  ```js
  const getData = async () => {
    try {
      const response = await fetch(endpoint, { cache: 'no-cache' });
      if (response.ok) {
        const jsonResponse = await response.json();
        return jsonResponse;
      }
    } catch (error) {
      console.log(error);
    }
  };
  ```

> **Beyond the cheatsheets**
> - **important gotcha**: `fetch` only rejects on *network* failure, not on HTTP error statuses. A 404 or 500 still resolves, with `response.ok === false`. Always check `response.ok` (or `response.status`) yourself ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch))
> - cancel an in-flight request with an **`AbortController`** and its `signal` option, essential for cleaning up requests in React effects ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortController))
> - set `headers: { 'Content-Type': 'application/json' }` when sending a JSON body so the server parses it correctly ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Headers))

### Legacy XHR / AJAX

> Historical context. You will see this in older codebases, but write `fetch` (or a library) in new code.

- **AJAX** (Asynchronous JavaScript And XML) is the original technique for making requests after the page has loaded, enabling dynamic updates without a full reload
- despite the name, it is not limited to XML; JSON is the usual payload today
- it is powered by the **`XMLHttpRequest`** (XHR) object, the pre-`fetch` way to make requests
- XHR uses an event/callback model with noticeably more boilerplate than `fetch` (open a request, set handlers, send), which is the main reason `fetch` and libraries replaced it

> **Beyond the cheatsheets**
> - the one capability XHR retained over `fetch` for years was upload **progress events**; for most other needs `fetch` or `axios` is the better choice ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest))

### Ecosystem & tooling

> Background on how data fetching looks in real front-end apps. The React and Redux specifics live in their own notes; this is just the map.

- **`fetch`** is built in and dependency-free; **`axios`** is a popular library that adds conveniences (automatic JSON parsing, easier error handling on bad statuses, request/response interceptors, wider environment support)
- in **React** apps, raw `fetch`-in-`useEffect` works but is verbose and easy to get wrong (race conditions, missing cleanup, manual loading/error state); dedicated data-fetching libraries handle caching, deduplication, and refetching:
  - **TanStack Query** (formerly React Query) and **SWR**: general-purpose server-state libraries
  - **RTK Query**: the data-fetching layer built into Redux Toolkit (see the Redux notes)
- a recurring pattern regardless of tool: model the **loading / success / error** states explicitly so the UI can render each (an enum or status field beats scattered booleans)
- pointers to sibling files: **promises and async/await in app code** appear throughout the **React** notes (effects, event handlers) and **Redux** notes (async thunks, RTK Query)

## Cheatsheet links

34. [Learn JavaScript: Asynchronous Programming](https://www.codecademy.com/learn/asynchronous-javascript/modules/javascript-promises/cheatsheet)
35. [Learn JavaScript: Requests](https://www.codecademy.com/learn/learn-javascript-requests/modules/intermediate-javascript-requests-course/cheatsheet)
36. [Create a Front-End App with React - AJAX Requests and API Interactions](https://www.codecademy.com/learn/bwa-ajax-requests-and-api-interactions/modules/bwa-http-requests/cheatsheet)
