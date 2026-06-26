# JavaScript

JavaScript is the behavior layer of the web: the language that makes pages interactive. Alongside HTML (structure) and CSS (presentation), it runs in every browser, and via Node.js on servers too. It is dynamically typed (variables aren't locked to one type) and single-threaded (one thing at a time), with first-class functions (functions are values you can pass around) as a defining trait.

## Notes

### Fundamentals & variables

- **variables** name a piece of data in memory:
  - `const`: preferred default; cannot be reassigned (must be initialized)
  - `let`: use when the value will be reassigned; can be declared without a value (holds `undefined`)
  - `var`: pre-ES6, function-scoped; avoid in modern code
- **primitive data types** (immutable, compared by value):
  - `number` (integers + floats, no separate int type), `string`, `boolean`, `null` (intentional absence), `undefined` (uninitialized), plus `bigint` and `symbol`
- **strings**:
  - single `'` or double `"` quotes; `.length` gives character count
  - **template literals** use backticks and interpolate: `` `Hi ${name}, you are ${age}` ``
  - concatenate with `+`, though template literals are cleaner
- **operators**:
  - arithmetic: `+` `-` `*` `/` `%` (modulo / remainder)
  - assignment: `=`, plus compound `+=` `-=` `*=` `/=`
- **comments**: `//` single-line, `/* ... */` multi-line
- `console.log()` prints to the console (debugging, output)
- **built-in objects** carry utility methods, e.g. `Math.random()` (0 to <1), `Math.floor()` (round down)

> **Beyond the cheatsheets**
> - default to `const`; reach for `let` only when reassignment is needed. This makes accidental reassignment a visible error and signals intent ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const))
> - `typeof x` returns a value's type as a string; useful for quick checks ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof))
> - JavaScript has two equality families: `===` (strict, no type coercion) and `==` (loose, coerces types). Prefer `===` to avoid surprises like `0 == ''` being `true` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Strict_equality))

### Conditionals & control flow

- **control flow**: code runs top-to-bottom unless a structure redirects it
- **comparison operators** return booleans: `===` (strict equal), `!==` (strict not equal), `>`, `>=`, `<`, `<=`
  - `===` checks value *and* type; `1 === '1'` is `false`
- **logical operators**: `&&` (AND, all truthy), `||` (OR, any truthy), `!` (NOT, inverts)
- **truthy / falsy**: every value coerces to a boolean in a condition
  - falsy values: `false`, `0`, `''` (empty string), `null`, `undefined`, `NaN`; everything else is truthy
- `if` / `else if` / `else`: branch on conditions
- **ternary operator**: compact two-way choice, `condition ? ifTrue : ifFalse`
- `switch`: match one expression against many `case` clauses; each needs `break` (or it falls through), with optional `default`

> **Beyond the cheatsheets**
> - short-circuiting: `a && b` returns `b` if `a` is truthy (else `a`); `a || b` returns the first truthy value. Handy for defaults and guards ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR))
> - nullish coalescing `??` returns the right side only when the left is `null`/`undefined` (not for other falsy values like `0` or `''`): `const port = input ?? 8080` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing))

### Functions & scope

- a **function** is a reusable, named (or anonymous) block that optionally takes inputs and returns a value
- **declaration**: `function add(a, b) { return a + b; }`; hoisted (usable before its definition)
- **expression**: `const add = function(a, b) { ... }`; assigned to a variable, not hoisted
- **arrow function** (ES6): `const add = (a, b) => a + b`
  - single expression: implicit return, no `{}` or `return` needed
  - single parameter: parentheses optional
- **parameters** are placeholders in the definition; **arguments** are the actual values passed at call time
- `return` ends execution and passes a value back; without it a function returns `undefined`
- **calling**: `add(2, 3)` runs the body
- **scope** is where a name is accessible:
  - global (everywhere), module/file, function, and block (`{ ... }`)
  - `let` and `const` are block-scoped; accessing them outside their block throws a `ReferenceError`
  - keep globals to a minimum to avoid naming collisions and tight coupling

> **Beyond the cheatsheets**
> - default parameters: `function greet(name = 'friend') { ... }` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters))
> - rest parameters gather extra arguments into an array: `function sum(...nums) { ... }` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters))
> - a **closure** is a function that remembers variables from where it was defined, even after that outer scope has returned; the foundation of much JS patterning ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures))

### Arrays & loops

- an **array** is an ordered list, any types mixed, written with `[]`
- **index** access starts at `0`: `arr[0]`; `.length` gives the count
- **core mutation methods**:
  - `.push(x)` adds to the end (returns new length), `.pop()` removes + returns the last
  - (also common: `.shift()` / `.unshift()` for the front)
- arrays are **mutable even when `const`**: you can change contents, just not reassign the binding
- **loops** repeat a block until a stopping condition:
  - `for`: `for (let i = 0; i < n; i++) { ... }` (init; condition; update)
  - `while`: checks condition before each run
  - `do...while`: runs once, then checks (guarantees at least one execution)
  - nested loops: inner runs fully per outer iteration
- `break` exits a loop immediately; `continue` skips to the next iteration
- loop an array via `for (let i = 0; i < arr.length; i++)`

> **Beyond the cheatsheets**
> - `for...of` iterates values directly, cleaner than index loops: `for (const item of arr) { ... }` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of))
> - the **spread** operator `...` expands arrays: `[...a, ...b]` to merge, `[...arr]` to shallow-copy ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax))
> - search helpers beyond the basics: `.includes(x)`, `.indexOf(x)`, `.find(fn)`, `.some(fn)`, `.every(fn)` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#instance_methods))

### Objects

- an **object** stores **key-value pairs** (properties); keys are strings/symbols, values are any type; written with `{}`
- **access**: dot notation `obj.key`, or bracket `obj['key']` (needed for dynamic or invalid-identifier keys); nested via chaining `obj.a.b`
- accessing a missing property returns `undefined`
- **mutable even when `const`**: add, change, or `delete obj.key`; only reassigning the binding is blocked
- iterate keys with `for...in`
- **methods** are function-valued properties; shorthand `obj.method()` or arrow syntax
- **`this`** refers to the object a method is called on
  - arrow functions have *no own* `this` (they inherit the surrounding scope), so they are a poor choice for object methods
- **getters / setters**: `get`/`set` intercept property reads/writes (often with a `_name` backing field); enable validation
- **factory function**: a function that returns a customized object
- **destructuring**: extract properties into variables, `const { a, b } = obj`
- **shorthand property names**: `{ activity }` is `{ activity: activity }`
- objects are passed **by reference**: a function receives the object itself (mutations stick), unlike primitives passed by value

> **Beyond the cheatsheets**
> - optional chaining `?.` safely accesses deep properties, returning `undefined` instead of throwing: `user?.address?.city` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining))
> - object spread copies/merges: `const updated = { ...original, status: 'active' }`; the standard immutable-update pattern in React/Redux ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals))
> - useful statics: `Object.keys(obj)`, `Object.values(obj)`, `Object.entries(obj)` for iterating ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object))

### Higher-order functions & iterators

- functions are **first-class**: they can be assigned to variables, passed as arguments, and returned from other functions
- a **callback** is a function passed into another function to be invoked later
- a **higher-order function** takes and/or returns a function
- **iterator methods** loop arrays declaratively (cleaner than `for` loops):
  - `.forEach(fn)`: runs `fn` on each element (no return value)
  - `.map(fn)`: returns a **new** array of transformed elements
  - `.filter(fn)`: returns a **new** array of elements where `fn` returns `true`
  - `.reduce((acc, cur) => ..., initial)`: collapses the array to a single value
- `.map()` and `.filter()` do not mutate the original array

> **Beyond the cheatsheets**
> - these pair naturally with arrow functions: `nums.map(n => n * 2).filter(n => n > 10)` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map))
> - prefer `.map`/`.filter`/`.reduce` over manual loops when transforming data; they express intent and avoid off-by-one errors ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects))

### Classes

- **classes** are a syntax for creating objects that share structure and behavior (syntactic sugar over JavaScript's prototype system)
- create instances with `new ClassName()`
- **`constructor`**: special method run at instantiation; sets initial properties via `this`
- **methods**: defined inside the class body, no commas between them
- **`static` methods**: called on the class itself, not instances (utility helpers): `ClassName.method()`
- **inheritance** with `extends`: a child class gains the parent's properties and methods
  - the child constructor calls `super(...)` to run the parent constructor first

> **Beyond the cheatsheets**
> - private fields use a `#` prefix, true privacy enforced by the language (vs. the `_name` convention): `#balance` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties))
> - classes are sugar over **prototypes**, JavaScript's underlying inheritance mechanism; worth understanding what the sugar hides ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain))

### Modules

- **modules** split code across files so functionality can be shared without copy-paste; each file is its own scope
- **named exports**: export multiple values, import by matching name in `{}`
  ```js
  // math.js
  export const add = (a, b) => a + b;
  export const PI = 3.14159;
  // main.js
  import { add, PI } from './math.js';
  ```
- **default export**: one per module; imported without braces, any name
  ```js
  // greet.js
  export default function greet(name) { ... }
  // main.js
  import greet from './greet.js';
  ```
- imports can be renamed (`import { add as sum }`) to avoid collisions
- local module paths reference the file without extension in many setups; modules run in strict mode by default

> **Beyond the cheatsheets**
> - this is **ES Modules (ESM)**, the standard. Node historically used **CommonJS** (`require()` / `module.exports`); you will still see both ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules))
> - in the browser, a module script is loaded with `<script type="module">` ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/module))

### Error handling

- a **runtime error** occurs during execution; code after an uncaught thrown error does not run
- `Error('message')` constructs an error object (with a `message` property); on its own it does not halt anything
- **`throw`** raises an error, stopping execution: `throw Error('Something went wrong')`
- **`try...catch`** anticipates and handles errors so the program continues:
  ```js
  try {
    riskyOperation();
  } catch (e) {
    console.log(e); // the thrown Error object
  }
  ```
- common built-in **error types**:
  - `ReferenceError`: using a variable that doesn't exist
  - `TypeError`: an operation on the wrong type (e.g. a string method on a number)
  - `SyntaxError`: invalid code the engine can't parse
- a **stack trace** reports the error type, message, and line; MDN and Stack Overflow are the go-to references

> **Beyond the cheatsheets**
> - `try...catch` also takes an optional `finally` block that always runs (cleanup), whether or not an error was thrown ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch))
> - throw `Error` objects, not strings; they carry a stack trace. You can subclass `Error` for custom error types ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error))
> - async error handling (rejected promises, `try/catch` with `await`) is covered in the async/HTTP notes

### The DOM & events

- the **DOM (Document Object Model)** is the browser's live, tree-like object representation of the page; JavaScript reads and modifies it to create dynamic HTML
- **nodes** are the tree's units (elements, text, attributes); one **root** descends into a branching hierarchy mirroring HTML nesting (parent / child)
- **`<script>`** embeds or links JS; loading attributes matter:
  - `src` points to an external file (relative or absolute path)
  - `defer`: download in parallel, execute after HTML is parsed (external scripts only)
  - `async`: download in parallel, execute as soon as ready (may interrupt parsing)
- the **`document`** object is the entry point to the DOM (e.g. `document.body`)
- **selecting elements**:
  - `document.getElementById('id')` (returns one, or `null`)
  - `document.querySelector('css-selector')` (first match; works with any CSS selector)
- **traversing**: `element.parentNode` for the direct parent
- **modifying**:
  - `element.innerHTML`: read or overwrite an element's HTML contents
  - `document.createElement('tag')`: make a new element (not yet in the DOM)
  - `parent.appendChild(node)`: attach as last child; `parent.removeChild(node)`: detach
  - `element.style.property`: set inline CSS (camelCase, so `background-color` becomes `backgroundColor`)
- **events**: `element.onclick = function() { ... }` runs code on click

> **Beyond the cheatsheets**
> - prefer `addEventListener('click', fn)` over `.onclick`: it allows multiple handlers and finer control. `.onclick` overwrites any previous handler ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener))
> - `querySelectorAll` returns all matches; `textContent` is a safer alternative to `innerHTML` when inserting plain text (avoids injection) ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll))
> - `classList` (`.add`, `.remove`, `.toggle`) manages classes more cleanly than editing `className` ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList))

### Regular expressions

- a **regular expression (regex)** is a pattern for matching text: validation, search, parsing
- **literals**: plain characters match themselves (`monkey` matches "monkey")
- **wildcards**: `.` matches any single character
- **character sets**: `[sc]` matches any one listed character; **ranges** `[a-z]`, `[A-Z]`, `[0-9]`, `[A-Za-z]`
- **shorthand classes**: `\w` word char `[A-Za-z0-9_]`, `\d` digit `[0-9]`, `\s` whitespace; uppercase negates (`\W`, `\D`, `\S`)
- **quantifiers**:
  - `?` optional (0 or 1), `*` Kleene star (0 or more), `+` Kleene plus (1 or more)
  - fixed `{3}` exactly three, `{3,6}` between three and six
- **anchors**: `^` start of string, `$` end of string
- **alternation**: `|` matches either side (`cat|dog`)
- **grouping**: `()` scopes alternation/quantifiers, e.g. `I love (cats|dogs)`

> **Beyond the cheatsheets**
> - the Codecademy sheet is language-agnostic; in JavaScript a regex is written `/pattern/flags`. Common flags: `g` (global), `i` (case-insensitive), `m` (multiline) ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions))
> - test and use them with `regex.test(str)` (boolean), `str.match(regex)`, `str.replace(regex, repl)` ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test))
> - [regex101.com](https://regex101.com) is the standard interactive tester/explainer

### Testing

- **why test**: catch bugs before users do; automated tests give fast feedback as code changes
- the sheet uses **Mocha** (test framework) with Node's **`assert`** library
- **structure**:
  - `describe('group', () => { ... })` groups related tests (nestable)
  - `it('does something', () => { ... })` is a single test containing assertions
- **assertions** (throw `AssertionError` on failure):
  - `assert.ok(expr)`: passes if `expr` is truthy
  - `assert.equal(a, b)`: loose equality (`==`)
  - `assert.strictEqual(a, b)`: strict equality (`===`)
  - `assert.deepEqual(a, b)`: compares values inside objects/arrays
- **the four phases** of a test: setup, exercise, verify, teardown
- tests should run in **isolation**: order-independent, no test affecting another
- **hooks** manage shared setup/teardown: `before` / `after` (once per suite), `beforeEach` / `afterEach` (around every test)

> **Beyond the cheatsheets**
> - Mocha is dated for front-end work; **Vitest** (Vite-native) and **Jest** are today's common choices, with a similar `describe`/`it`/`expect` shape but a built-in assertion + mocking toolkit ([Vitest](https://vitest.dev), [Jest](https://jestjs.io))
> - modern assertions use `expect(value).toBe(...)` / `.toEqual(...)` rather than the `assert` library ([Vitest expect](https://vitest.dev/api/expect.html))
> - for testing UI components, **React Testing Library** pairs with Vitest/Jest to test behavior over implementation ([Testing Library](https://testing-library.com))

### Ecosystem & tooling

> Background on the surrounding landscape. Some of these have dedicated notes elsewhere (async, HTTP, and `fetch` live in the async/HTTP file; React, Redux, and TypeScript have their own files), so this is just a map.

- **runtimes**: JS runs in browsers and on the server via **Node.js**; newer runtimes include **Deno** and **Bun** (Bun also bundles a fast package manager and test runner)
- **package managers**: **npm** (default, ships with Node), plus **pnpm** and **yarn**; they install dependencies into `node_modules` from a `package.json`
- **bundlers / build tools**: **Vite** (the modern default; fast dev server + build), historically **webpack**. They bundle modules, transpile, and optimize for the browser
- **TypeScript**: a typed superset of JavaScript that compiles to JS; catches type errors before runtime (see the TypeScript notes)
- **linting / formatting**: **ESLint** (catches problems and enforces rules) and **Prettier** (auto-formats); standard in most projects
- **transpilers**: **Babel** converts modern JS to older-compatible JS for broader browser support
- pointers to sibling files: **async / promises / `fetch` / HTTP** (async-http notes), **React** and **Redux** (their own notes), **Node.js back-end** (Node notes)

## Cheatsheet links

18. [Learn JavaScript](https://www.codecademy.com/learn/introduction-to-javascript/modules/learn-javascript-introduction/cheatsheet) / duplicate: [Learn JavaScript: Fundamentals](https://www.codecademy.com/learn/learn-javascript-fundamentals/modules/learn-javascript-introduction/cheatsheet)
19. [Learn JavaScript: Functions and Scope](https://www.codecademy.com/learn/learn-javascript-functions-and-scope/modules/learn-javascript-functions/cheatsheet)
20. [Learn JavaScript: Arrays and Loops](https://www.codecademy.com/learn/learn-javascript-arrays-and-loops/modules/learn-javascript-arrays/cheatsheet)
21. [Learn JavaScript: Objects](https://www.codecademy.com/learn/learn-javascript-objects/modules/learn-javascript-objects-course/cheatsheet)
22. [Learn JavaScript: Iterators](https://www.codecademy.com/learn/learn-javascript-iterators/modules/learn-javascript-iterators-course/cheatsheet)
23. [Learn Intermediate JavaScript](https://www.codecademy.com/learn/learn-intermediate-javascript/modules/learn-javascript-classes/cheatsheet) / duplicate: [Learn JavaScript: Classes and Modules](https://www.codecademy.com/learn/learn-javascript-classes-and-modules/modules/learn-javascript-classes/cheatsheet)
24. [Learn JavaScript: Error Handling](https://www.codecademy.com/learn/javascript-errors-debugging/modules/errors-and-error-handling-course/cheatsheet)
25. [Building Interactive JavaScript Websites](https://www.codecademy.com/learn/build-interactive-websites/modules/web-dev-interactive-websites/cheatsheet)
26. [Learn the Basics of Regular Expressions](https://www.codecademy.com/learn/introduction-to-regular-expressions/modules/intro-to-regex/cheatsheet)
27. [Create a Front-End App with React - Modern JavaScript: Modules and Browser Compatibility](https://www.codecademy.com/learn/bwa-modern-javascript-modules-and-browser-compatibility/modules/learn-javascript-transpilation/cheatsheet)
28. [Create a Front-End App with React - JavaScript Functions, Arrays, and Loops](https://www.codecademy.com/learn/bwa-javascript-functions-arrays-and-loops/modules/learn-javascript-control-flow/cheatsheet)
29. [Create a Front-End App with React - JavaScript Iterators, Objects, and Classes](https://www.codecademy.com/learn/bwa-javascript-iterators-objects-and-classes/modules/learn-javascript-iterators/cheatsheet)
30. [Learn JavaScript Unit Testing](https://www.codecademy.com/learn/learn-javascript-unit-testing/modules/learn-mocha-and-assert/cheatsheet)
