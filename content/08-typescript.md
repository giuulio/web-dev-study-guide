# TypeScript

TypeScript is a **superset of JavaScript** that adds a static **type system**: every valid JS program is valid TS, and on top of that you annotate the shapes of your data so a compiler can catch mistakes before the code runs. The types exist only at development time; they are stripped out when TypeScript compiles to plain JavaScript. This guide runs from the type system itself outward through richer types, classes, and tooling. It assumes the JavaScript notes as background, and the React notes for where TypeScript replaces `propTypes`.

## Notes

### What TypeScript is & the type system

- TypeScript is a **superset of JavaScript**: all JS is valid TS, plus a layer of types
- the **type system** is a set of tools that checks the types of values as you write code, flagging mismatches before runtime
- **type inference**: TypeScript assumes a variable's type from the value first assigned to it, and complains if you later reassign an incompatible type
  ```ts
  let count = 5;    // inferred as number
  count = 'hello';  // Error: 'string' is not assignable to 'number'
  ```
- **type annotations**: explicitly declare a type by appending a colon and the type
  ```ts
  let count: number;     // useful when declaring without an initial value
  let name: string = 'Carlo';
  ```
- TypeScript knows the **shape** of objects (what properties exist) and errors when you access members that do not exist, often suggesting corrections
- types are a **compile-time** feature only: they are removed when TS is transpiled to JavaScript, so they add zero runtime cost
- the payoff: errors caught while typing, safer refactors, and editor autocomplete that understands your data

> **Beyond the cheatsheets**
> - TypeScript performs **structural typing**: compatibility is decided by an object's shape, not by an explicit declared name (if it has the right properties, it fits) ([typescriptlang.org](https://www.typescriptlang.org/docs/handbook/type-compatibility.html))
> - the goal is to make invalid states **unrepresentable**: the same idea behind a load-state enum, expressed at the type level so the compiler enforces it

### Primitive & basic types

- TypeScript recognizes all JavaScript **primitives**: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`
- a variable declared without an initial value defaults to **`any`**, which opts out of type checking and can be reassigned to anything without error
- **`void`**: the return type of a function that returns no value
- **`object`**: any non-primitive value (distinct from the empty object type `{}`)
- annotating a variable pins it to one type for its whole life:
  ```ts
  let isDone: boolean = false;
  let total: number;
  ```

> **Beyond the cheatsheets**
> - prefer **`unknown`** over `any` when a type is genuinely not known yet: `unknown` is the type-safe counterpart, forcing you to narrow before use, whereas `any` silently disables checking and defeats the point of TypeScript ([typescriptlang.org](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#unknown))
> - enabling `strict` mode in the config (later section) turns on `strictNullChecks`, so `null` and `undefined` must be handled explicitly rather than slipping through

### Functions

- function **parameters** take type annotations with the same colon syntax as variables, ensuring callers pass the right types
  ```ts
  function greet(name: string) { /* ... */ }
  ```
- **optional parameters**: append `?` after the name (before the colon); the parameter's type becomes `T | undefined`
  ```ts
  function log(message: string, userId?: string) { /* ... */ }
  ```
- **default parameters**: assign a default and TypeScript infers the parameter's type from it
  ```ts
  function logAge(age: number, name = '(anonymous)') { /* name inferred string */ }
  ```
- **return types**: TypeScript infers them from the `return` statements, or you can annotate explicitly after the parameter list's closing parenthesis
  ```ts
  function add(a: number, b: number): number {
    return a + b;
  }
  ```
- a function with no return value has return type **`void`**
- a **function type alias** describes a function's signature for reuse (see type aliases below):
  ```ts
  type NumberArrayToNumber = (numbers: number[]) => number;
  ```

> **Beyond the cheatsheets**
> - an explicit return type is worth adding on exported/public functions: it documents intent and makes the compiler catch a wrong return where it is written, not at some distant call site ([typescriptlang.org](https://www.typescriptlang.org/docs/handbook/2/functions.html))

### Arrays, tuples & enums

- **array types** two equivalent notations: `type[]` or `Array<T>`
  ```ts
  let scores: number[] = [90, 85, 100];
  let names: Array<string> = ['a', 'b'];
  ```
  - extra `[]` per dimension for multidimensional arrays (`number[][]`); an empty array of any type is fine
- **tuples**: a fixed-length array with a specific type at each position
  ```ts
  let point: [number, number] = [3, 4];
  let record: [string, number] = ['age', 30];
  ```
  - an array literal is **inferred as an array, not a tuple**; you must annotate to get a tuple
  - calling **`.concat()`** on a tuple returns a plain array, not a tuple
  - a function **rest parameter** is implicitly `any[]`; annotate it (`...nums: number[]`) so the call site is type-checked
- **enums**: a named set of constant values
  - **numeric enums**: members get auto-incrementing numbers from `0` (overridable)
  - **string enums**: each member must be assigned a string value
  ```ts
  enum Direction { Up, Down, Left, Right } // 0, 1, 2, 3
  enum Status { Active = 'ACTIVE', Done = 'DONE' }
  ```

> **Beyond the cheatsheets**
> - modern TypeScript often prefers **union literal types** (`type Status = 'active' | 'done'`, next section) over enums: they have no runtime output, work directly with strings, and avoid several enum footguns. Enums are still common in existing code, so it is worth knowing both ([the union-of-literals approach is the same idea as a load-state enum from the JS/React notes](https://www.typescriptlang.org/docs/handbook/enums.html#objects-vs-enums))

### Object types, type aliases & interfaces

- **object type annotations** describe the properties an object literal must have and their value types
  ```ts
  let user: { name: string; age: number } = { name: 'Carlo', age: 30 };
  ```
- a **type alias** (`type` keyword) names a type so you can reuse it; it can alias **objects, unions, primitives, or function types**
  ```ts
  type ID = string | number;
  type User = { name: string; age: number };
  ```
- an **interface** describes the shape of an object; unlike `type`, it can **only** describe objects, which makes it a natural fit for classes and OOP
  ```ts
  interface User {
    name: string;
    age: number;
  }
  ```
- **`implements`**: a class can implement an interface; TypeScript checks the class has every property and method the interface requires
- **`extends`**: an interface can inherit from another interface; interfaces can also be nested
- **index signatures**: when property names are not known ahead of time, type them by key
  ```ts
  interface Scores { [studentName: string]: number }
  ```
- **optional properties**: append `?` to a property name to make it optional
  ```ts
  interface Config { debug?: boolean }
  ```

> **Beyond the cheatsheets**
> - **interface vs type, the practical rule**: reach for **`interface`** when describing the shape of an object or a public API (it extends cleanly and gives better error messages), and **`type`** for unions, primitives, function types, tuples, and anything that is not a plain object shape. Both work for objects; this split is convention, not a hard requirement ([typescriptlang.org](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces))
> - **utility types** transform existing types instead of rewriting them: `Partial<T>` (all properties optional), `Required<T>`, `Readonly<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`. These save a lot of duplicate type definitions ([typescriptlang.org](https://www.typescriptlang.org/docs/handbook/utility-types.html))

### Union types & type narrowing

- a **union type** allows a value to be one of several types, written with the `|` pipe
  ```ts
  let id: string | number;
  ```
- a **union of array types** needs parentheses: `(string | number)[]`
- on a union value, TypeScript only lets you access **members common to all** member types until you narrow it
- **literal type unions** restrict a value to specific exact values, ideal for modeling distinct states
  ```ts
  type LightColor = 'green' | 'yellow' | 'red';
  function changeLight(color: LightColor) { /* ... */ }
  changeLight('purple'); // Error: not a valid LightColor
  ```
- **type narrowing**: helping TypeScript figure out the specific type of a union value in a given branch, via a **type guard**
  - **`typeof`** for primitives: `if (typeof x === 'string') { /* x is string here */ }`
  - **`in`** for objects: `if ('swim' in pet) { /* pet has swim */ }`
  - control-flow narrowing: an `if`/`else`, or an `if` with a `return`, narrows the remaining code to the other member type(s)
- **type assertions** (`as`): tell the compiler you know a value's type more specifically than it does
  ```ts
  let value: unknown = getValue();
  let str = value as string;
  ```

> **Beyond the cheatsheets**
> - a **discriminated union** gives each member a shared literal "tag" property, so checking that one field narrows the whole object: the cleanest pattern for modeling states like the idle/loading/loaded/failed lifecycle ([typescriptlang.org](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions))
>   ```ts
>   type Load =
>     | { status: 'loading' }
>     | { status: 'loaded'; data: string }
>     | { status: 'failed'; error: string };
>   ```
> - use `as` sparingly: it overrides the compiler's checks, so a wrong assertion hides a real bug rather than catching it

### Generics

- **generics** let a type or function work over a type supplied later, keeping full type safety instead of falling back to `any`
- the built-in **`Array<T>`** is generic: `T` is the element type
- a **generic type alias** uses angle brackets with a type parameter
  ```ts
  type Container<T> = { value: T };
  let box: Container<number> = { value: 42 };
  ```
- a **generic function** declares its type parameter after the name, then uses it for parameters and return type
  ```ts
  function first<T>(items: T[]): T {
    return items[0];
  }
  const n = first([1, 2, 3]);     // T inferred as number
  const s = first(['a', 'b']);    // T inferred as string
  ```
- the type parameter symbol can be any name (`T`, `U`, `Item`); `T` is just convention

> **Beyond the cheatsheets**
> - **generic constraints** with `extends` restrict what a type parameter can be, so you can safely use specific properties: `function longest<T extends { length: number }>(a: T, b: T)` ([typescriptlang.org](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints))
> - generics are everywhere in typed React: `useState<string>()`, `useRef<HTMLInputElement>(null)`, and typed props all lean on them (see the React notes)

### Classes

- TypeScript adds type annotations and access control to JavaScript classes; properties and methods can be typed like anything else
- **access modifiers** control where a member can be used:
  - **`public`** (default): accessible everywhere; the keyword is for readability and does not change how the code compiles
  - **`private`**: accessible only inside the class; using it in a subclass or on an instance is a compile error
  - **`protected`**: accessible inside the class and its subclasses, but not on outside instances
- **`readonly`**: a property can be assigned at declaration or in the constructor, but never reassigned afterward
  ```ts
  class Account {
    public owner: string;
    private balance: number;
    readonly id: string;

    constructor(owner: string, id: string) {
      this.owner = owner;
      this.balance = 0;
      this.id = id;
    }
  }
  ```
- a class can **`implements`** an interface to guarantee it provides the required shape (object-types section)

> **Beyond the cheatsheets**
> - a **parameter property** is a shorthand: marking a constructor parameter with a modifier (`constructor(private balance: number)`) declares and assigns the field in one step ([typescriptlang.org](https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties))
> - TypeScript's `private` is enforced at compile time; JavaScript's own `#private` fields enforce privacy at runtime too, and the two are sometimes combined

### Configuration & tooling

- **`tsc`** is the TypeScript compiler CLI; it type-checks and **transpiles** `.ts` files to JavaScript
- **`tsc --init`** generates a **`tsconfig.json`**, the project's config file
- **`tsconfig.json`** holds **`compilerOptions`** that control type-checking and output behavior (target JS version, module system, strictness, etc.); the top-level **`extends`** option lets one config inherit from another base config
- CLI **flags** alter behavior, e.g. `--noUnusedLocals` errors on unused variables; many flags have `tsconfig.json` equivalents
- installing TypeScript as a **project dependency** (rather than globally) pins the project to a specific compiler version
- **editor integration**: VS Code shows TypeScript errors inline as you type and aggregated in the Problems panel, no separate compile step needed to see them

> **Beyond the cheatsheets**
> - turn on **`"strict": true`** in `compilerOptions`; it is the recommended baseline and enables the whole family of strict checks (null checking, implicit-any errors, and more) ([typescriptlang.org](https://www.typescriptlang.org/tsconfig/#strict))
> - in real projects you rarely run `tsc` by hand for the build: **Vite** (and similar tools) transpile TypeScript via esbuild instantly and use `tsc --noEmit` only for type-checking (see the build tooling in the React notes)

### Ecosystem & tooling

> Background on where TypeScript sits in a modern stack. The deep dives live in sibling notes; this is the map.

- **why TypeScript**: it is now the default for serious JavaScript projects; the type safety pays off most as a codebase and team grow, and editor tooling (autocomplete, refactoring, inline errors) is a daily productivity gain
- **TypeScript with React**: replaces the runtime `propTypes` from the React notes with compile-time prop types
  ```tsx
  type ButtonProps = { label: string; onClick: () => void };
  function Button({ label, onClick }: ButtonProps) { /* ... */ }
  ```
  - hooks are generic: `useState<number>(0)`, `useRef<HTMLInputElement>(null)`
  - Vite's React + TypeScript template wires all of this up out of the box
- **build setup**: Vite/esbuild for fast transpile, `tsc --noEmit` for type-checking in CI, ESLint with the TypeScript plugin for linting
- **the `satisfies` operator**: checks a value against a type without widening it, keeping the precise inferred type while still validating the shape (a newer feature worth knowing)
- **`as const`**: freezes a literal to its narrowest type and makes it readonly, handy for deriving union types from arrays and for action-type constants
- pointers to sibling files: **classes and JS fundamentals** (JavaScript notes), **typing props, hooks, and replacing propTypes** (React notes), **build tools and Vite** (React notes ecosystem section)

## Cheatsheet links

51. [Learn TypeScript](https://www.codecademy.com/learn/learn-typescript/modules/learn-typescript-types/cheatsheet)
52. [Learn TypeScript: Fundamentals](https://www.codecademy.com/learn/learn-typescript-fundamentals/modules/learn-typescript-types-course/cheatsheet)
53. [Learn TypeScript: Object Types](https://www.codecademy.com/learn/learn-typescript-object-types/modules/learn-typescript-object-types-course/cheatsheet)
54. [Learn TypeScript: Union Types](https://www.codecademy.com/learn/learn-typescript-union-types/modules/learn-typescript-union-types-course/cheatsheet)
55. [Learn TypeScript: Functions](https://www.codecademy.com/learn/learn-typescript-functions/modules/typescript-functions-course/cheatsheet)
56. [Learn TypeScript: Type Narrowing](https://www.codecademy.com/learn/learn-typescript-type-narrowing/modules/learn-typescript-type-narrowing-course/cheatsheet)
57. [Learn TypeScript: Complex Types](https://www.codecademy.com/learn/learn-typescript-complex-types/modules/learn-typescript-complex-types-course/cheatsheet)
58. [Learn Intermediate TypeScript](https://www.codecademy.com/learn/learn-intermediate-typescript/modules/type-script-configuration/cheatsheet)
59. [Learn Intermediate TypeScript: Class Types](https://www.codecademy.com/learn/learn-intermediate-typescript-class-types/modules/type-script-class-types-cr/cheatsheet)
60. [Learn Intermediate TypeScript: Configuration](https://www.codecademy.com/learn/learn-intermediate-type-script-configuration/modules/type-script-configuration-cr/cheatsheet)
