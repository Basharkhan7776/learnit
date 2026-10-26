import fs from 'node:fs';
import path from 'node:path';
import type { Exercise } from '../src/types/exercise';

const exercises: Exercise[] = [];
let globalOrder = 1;

function addExercise(ex: Omit<Exercise, 'order'>) {
  exercises.push({
    ...ex,
    order: globalOrder++,
  });
}

// ============================================================================
// MODULE 01: Variables & Scope
// ============================================================================
const mod01Readme = `# Variables & Scope in JavaScript

JavaScript provides three keywords to declare variables: \`let\`, \`const\`, and \`var\`.

## Key Concepts
- **\`const\`**: Block-scoped, cannot be reassigned, must be initialized at declaration. Note that object/array contents can still be mutated unless frozen.
- **\`let\`**: Block-scoped, can be reassigned, exists in the Temporal Dead Zone (TDZ) before declaration.
- **\`var\`**: Function-scoped (ignores block scopes like \`if\` or \`for\`), hoisted and initialized with \`undefined\`.
- **Scope Shadowing**: An inner block can declare a variable with the same name as an outer variable without mutating the outer variable.

## References
- [MDN: let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)
- [MDN: const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const)`;

addExercise({
  id: 'var1',
  title: 'Let and Const',
  category: '01_variables',
  categoryTitle: 'Variables & Scope',
  categoryOrder: 1,
  categoryReadme: mod01Readme,
  path: 'exercises/01_variables/var1.js',
  filename: 'var1.js',
  language: 'javascript',
  mode: 'test',
  instructions: `var1.js

In JavaScript, 'const' variables cannot be reassigned, while 'let' variables can.

Fix the variable declarations so that 'greeting' can be updated, and 'MAX_USERS' remains a constant.`,
  hint: `Change the declaration of greeting to use 'let' instead of 'const'.`,
  starterCode: `// var1.js
// Fix the variable declarations below:

const greeting = "Hello";
// TODO: greeting needs to be updated, but const prevents reassignment!
greeting = "Welcome to Scripter!";

const MAX_USERS = 100;

test("variables can be assigned and reassigned correctly", () => {
  expect(greeting).toBe("Welcome to Scripter!");
  expect(MAX_USERS).toBe(100);
});
`,
  solutionCode: `// var1.js solution
let greeting = "Hello";
greeting = "Welcome to Scripter!";

const MAX_USERS = 100;

test("variables can be assigned and reassigned correctly", () => {
  expect(greeting).toBe("Welcome to Scripter!");
  expect(MAX_USERS).toBe(100);
});
`,
});

addExercise({
  id: 'var2',
  title: 'Block Scope & Shadowing',
  category: '01_variables',
  categoryTitle: 'Variables & Scope',
  categoryOrder: 1,
  categoryReadme: mod01Readme,
  path: 'exercises/01_variables/var2.js',
  filename: 'var2.js',
  language: 'javascript',
  mode: 'test',
  instructions: `var2.js

'let' and 'const' are block-scoped. Declaring a variable inside an inner block shadows the outer variable without overwriting it.

Complete the function 'computeScopedValues' so that it returns an object containing both the outer and inner values.`,
  hint: `Declare an inner variable inside the if block using 'let' or 'const'.`,
  starterCode: `// var2.js
function computeScopedValues() {
  let score = 10;
  let innerScore = 0;

  if (true) {
    // TODO: Shadow score inside this block by giving it value 50
    // and assign innerScore to that shadowed value.
    score = 50; 
  }

  return { outer: score, inner: innerScore };
}

test("demonstrates block scoping and variable shadowing", () => {
  const result = computeScopedValues();
  expect(result.outer).toBe(10);
  expect(result.inner).toBe(50);
});
`,
  solutionCode: `// var2.js solution
function computeScopedValues() {
  let score = 10;
  let innerScore = 0;

  if (true) {
    let score = 50; // Shadows outer score
    innerScore = score;
  }

  return { outer: score, inner: innerScore };
}

test("demonstrates block scoping and variable shadowing", () => {
  const result = computeScopedValues();
  expect(result.outer).toBe(10);
  expect(result.inner).toBe(50);
});
`,
});

// ============================================================================
// MODULE 02: Primitive Types & Coercion
// ============================================================================
const mod02Readme = `# Primitive Types & Type Coercion

JavaScript has 7 primitive types: \`string\`, \`number\`, \`boolean\`, \`null\`, \`undefined\`, \`symbol\`, and \`bigint\`.

## Key Concepts
- **\`typeof null\`**: Returns \`"object"\` due to a historical legacy quirk in JavaScript.
- **Strict Equality (\`===\`) vs Loose Equality (\`==\`)**: \`===\` checks value and type without coercion. \`==\` performs implicit type coercion.
- **Nullish Coalescing (\`??\`)**: Returns right-hand operand only when left-hand operand is \`null\` or \`undefined\`. Unlike \`||\`, it does NOT fall back on falsy values like \`0\` or \`""\`.
- **Optional Chaining (\`?.\`)**: Safely accesses nested object properties without throwing a \`TypeError\` if an intermediate value is nullish.`;

addExercise({
  id: 'types1',
  title: 'Primitives & Typeof Quirks',
  category: '02_primitive_types',
  categoryTitle: 'Primitive Types & Coercion',
  categoryOrder: 2,
  categoryReadme: mod02Readme,
  path: 'exercises/02_primitive_types/types1.js',
  filename: 'types1.js',
  language: 'javascript',
  mode: 'test',
  instructions: `types1.js

Implement the function 'getExactType(val)' that returns:
- 'null' for null (avoiding the typeof null === 'object' quirk)
- 'array' for Array instances
- otherwise the standard typeof result (e.g. 'string', 'number', 'boolean', 'undefined', 'bigint', 'symbol', 'object')`,
  hint: `Check if val === null first, then Array.isArray(val), then typeof val.`,
  starterCode: `// types1.js
function getExactType(val) {
  // TODO: Return 'null' if val is null, 'array' if Array, else typeof val
  return typeof val;
}

test("accurately identifies primitive and object types", () => {
  expect(getExactType("scripter")).toBe("string");
  expect(getExactType(42)).toBe("number");
  expect(getExactType(true)).toBe("boolean");
  expect(getExactType(undefined)).toBe("undefined");
  expect(getExactType(null)).toBe("null");
  expect(getExactType([1, 2, 3])).toBe("array");
  expect(getExactType({ a: 1 })).toBe("object");
});
`,
  solutionCode: `// types1.js solution
function getExactType(val) {
  if (val === null) return "null";
  if (Array.isArray(val)) return "array";
  return typeof val;
}

test("accurately identifies primitive and object types", () => {
  expect(getExactType("scripter")).toBe("string");
  expect(getExactType(42)).toBe("number");
  expect(getExactType(true)).toBe("boolean");
  expect(getExactType(undefined)).toBe("undefined");
  expect(getExactType(null)).toBe("null");
  expect(getExactType([1, 2, 3])).toBe("array");
  expect(getExactType({ a: 1 })).toBe("object");
});
`,
});

addExercise({
  id: 'types2',
  title: 'Nullish Coalescing vs Logical OR',
  category: '02_primitive_types',
  categoryTitle: 'Primitive Types & Coercion',
  categoryOrder: 2,
  categoryReadme: mod02Readme,
  path: 'exercises/02_primitive_types/types2.js',
  filename: 'types2.js',
  language: 'javascript',
  mode: 'test',
  instructions: `types2.js

The logical OR ('||') operator falls back when a value is falsy (like 0, false, or "").
The nullish coalescing operator ('??') only falls back when a value is strictly null or undefined.

Fix 'getUserSettings' to use '??' so that a score of 0 or a darkTheme of false are not accidentally replaced by defaults!`,
  hint: `Use config.score ?? defaultScore and config.darkTheme ?? defaultTheme.`,
  starterCode: `// types2.js
function getUserSettings(config) {
  // BUG: Using || overrides valid values like 0 and false!
  const score = config.score || 100;
  const darkTheme = config.darkTheme || true;
  const username = config.username || "Guest";

  return { score, darkTheme, username };
}

test("preserves valid 0 and false values with nullish coalescing", () => {
  const result = getUserSettings({ score: 0, darkTheme: false, username: "" });
  expect(result.score).toBe(0);
  expect(result.darkTheme).toBe(false);
  expect(result.username).toBe("");
});
`,
  solutionCode: `// types2.js solution
function getUserSettings(config) {
  const score = config.score ?? 100;
  const darkTheme = config.darkTheme ?? true;
  const username = config.username ?? "Guest";

  return { score, darkTheme, username };
}

test("preserves valid 0 and false values with nullish coalescing", () => {
  const result = getUserSettings({ score: 0, darkTheme: false, username: "" });
  expect(result.score).toBe(0);
  expect(result.darkTheme).toBe(false);
  expect(result.username).toBe("");
});
`,
});

// ============================================================================
// MODULE 03: Control Flow & Loops
// ============================================================================
const mod03Readme = `# Control Flow & Loops

Control flow determines the execution path of a program based on conditionals and iterative constructs.

## Key Concepts
- **\`for..of\`**: Iterates over values of any *iterable* (Arrays, Strings, Sets, Maps, Generators).
- **\`for..in\`**: Iterates over enumerable *property names (keys)* of an object.
- **\`switch\`**: Evaluates an expression against multiple cases using strict equality (\`===\`). Break statements prevent fallthrough.`;

addExercise({
  id: 'control1',
  title: 'Iterating Iterables with for..of',
  category: '03_control_flow',
  categoryTitle: 'Control Flow & Loops',
  categoryOrder: 3,
  categoryReadme: mod03Readme,
  path: 'exercises/03_control_flow/control1.js',
  filename: 'control1.js',
  language: 'javascript',
  mode: 'test',
  instructions: `control1.js

Implement 'sumEvenNumbers(numbers)' using a loop to sum only the even numbers from the array.`,
  hint: `Iterate through numbers with 'for (const n of numbers)'. If n % 2 === 0, add it to sum.`,
  starterCode: `// control1.js
function sumEvenNumbers(numbers) {
  let sum = 0;
  // TODO: Iterate over numbers and sum only even numbers
  return sum;
}

test("sums only even numbers in an array", () => {
  expect(sumEvenNumbers([1, 2, 3, 4, 5, 6])).toBe(12);
  expect(sumEvenNumbers([1, 3, 5])).toBe(0);
  expect(sumEvenNumbers([10, 20])).toBe(30);
});
`,
  solutionCode: `// control1.js solution
function sumEvenNumbers(numbers) {
  let sum = 0;
  for (const n of numbers) {
    if (n % 2 === 0) {
      sum += n;
    }
  }
  return sum;
}

test("sums only even numbers in an array", () => {
  expect(sumEvenNumbers([1, 2, 3, 4, 5, 6])).toBe(12);
  expect(sumEvenNumbers([1, 3, 5])).toBe(0);
  expect(sumEvenNumbers([10, 20])).toBe(30);
});
`,
});

// ============================================================================
// MODULE 04: Functions & Higher-Order Functions
// ============================================================================
const mod04Readme = `# Functions & Higher-Order Functions

Functions in JavaScript are first-class citizens: they can be passed as arguments, returned from other functions, and assigned to variables.

## Key Concepts
- **Arrow Functions**: Syntactically concise, do not have their own \`this\`, \`arguments\`, or \`super\`.
- **Rest Parameters (\`...args\`)**: Gathers remaining arguments into a true Array.
- **Higher-Order Functions**: Functions that accept functions as parameters or return a new function.`;

addExercise({
  id: 'fn1',
  title: 'Rest Parameters and Pipeline',
  category: '04_functions',
  categoryTitle: 'Functions',
  categoryOrder: 4,
  categoryReadme: mod04Readme,
  path: 'exercises/04_functions/fn1.js',
  filename: 'fn1.js',
  language: 'javascript',
  mode: 'test',
  instructions: `fn1.js

Implement 'createPipeline(...fns)' which takes any number of single-argument functions and returns a new function that pipes an input value through each function sequentially from left to right.`,
  hint: `Use rest parameters '...fns' and reduce: fns.reduce((acc, fn) => fn(acc), initialValue).`,
  starterCode: `// fn1.js
function createPipeline(...fns) {
  return function(initialValue) {
    // TODO: Pipe initialValue through every function in fns
    return initialValue;
  };
}

test("pipes value through multiple functions", () => {
  const double = x => x * 2;
  const addTen = x => x + 10;
  const square = x => x * x;

  const pipeline = createPipeline(double, addTen, square);
  // (5 * 2) = 10 -> (10 + 10) = 20 -> (20 * 20) = 400
  expect(pipeline(5)).toBe(400);
});
`,
  solutionCode: `// fn1.js solution
function createPipeline(...fns) {
  return function(initialValue) {
    return fns.reduce((acc, fn) => fn(acc), initialValue);
  };
}

test("pipes value through multiple functions", () => {
  const double = x => x * 2;
  const addTen = x => x + 10;
  const square = x => x * x;

  const pipeline = createPipeline(double, addTen, square);
  expect(pipeline(5)).toBe(400);
});
`,
});

// ============================================================================
// MODULE 05: Arrays & Array Methods
// ============================================================================
const mod05Readme = `# Arrays & Declarative Array Methods

JavaScript arrays feature powerful functional transformation methods.

## Key Concepts
- **\`map\`**: Creates a new array with the results of calling a provided function on every element.
- **\`filter\`**: Creates a shallow copy of a portion of an array filtered down to elements that pass the test.
- **\`reduce\`**: Executes a reducer function on each element, resulting in a single output value.
- **\`flatMap\`**: Maps each element using a mapping function, then flattens the result by one level.`;

addExercise({
  id: 'array1',
  title: 'Reduce Grouping and Aggregation',
  category: '05_arrays',
  categoryTitle: 'Arrays & Array Methods',
  categoryOrder: 5,
  categoryReadme: mod05Readme,
  path: 'exercises/05_arrays/array1.js',
  filename: 'array1.js',
  language: 'javascript',
  mode: 'test',
  instructions: `array1.js

Implement 'groupBy(arr, keySelector)' using Array.prototype.reduce to group elements of an array by the key returned by keySelector.`,
  hint: `accumulator[key] = accumulator[key] || []; accumulator[key].push(item); return accumulator.`,
  starterCode: `// array1.js
function groupBy(arr, keySelector) {
  // TODO: Use arr.reduce to group items into an object of arrays
  return {};
}

test("groups items by key selector", () => {
  const users = [
    { name: "Alice", role: "admin" },
    { name: "Bob", role: "user" },
    { name: "Charlie", role: "admin" },
  ];

  const grouped = groupBy(users, u => u.role);
  expect(grouped.admin).toHaveLength(2);
  expect(grouped.user).toHaveLength(1);
  expect(grouped.admin[0].name).toBe("Alice");
});
`,
  solutionCode: `// array1.js solution
function groupBy(arr, keySelector) {
  return arr.reduce((acc, item) => {
    const key = keySelector(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
}

test("groups items by key selector", () => {
  const users = [
    { name: "Alice", role: "admin" },
    { name: "Bob", role: "user" },
    { name: "Charlie", role: "admin" },
  ];

  const grouped = groupBy(users, u => u.role);
  expect(grouped.admin).toHaveLength(2);
  expect(grouped.user).toHaveLength(1);
  expect(grouped.admin[0].name).toBe("Alice");
});
`,
});

// ============================================================================
// MODULE 06: Objects & Property Descriptors
// ============================================================================
const mod06Readme = `# Objects & Property Descriptors

JavaScript objects are collections of keyed properties.

## Key Concepts
- **\`Object.entries()\` & \`Object.fromEntries()\`**: Transform between objects and key-value tuple arrays.
- **\`Object.freeze()\`**: Shallowly freezes an object so that properties cannot be added, removed, or changed.
- **\`Object.defineProperty()\`**: Defines or modifies a property with custom attributes (\`writable\`, \`enumerable\`, \`configurable\`, \`get\`, \`set\`).`;

addExercise({
  id: 'obj1',
  title: 'Deep Freeze Object Utility',
  category: '06_objects',
  categoryTitle: 'Objects & Data Structures',
  categoryOrder: 6,
  categoryReadme: mod06Readme,
  path: 'exercises/06_objects/obj1.js',
  filename: 'obj1.js',
  language: 'javascript',
  mode: 'test',
  instructions: `obj1.js

'Object.freeze' is shallow: nested objects remain mutable!
Implement 'deepFreeze(obj)' that recursively freezes the object and all nested objects, returning the frozen object.`,
  hint: `Call Object.freeze(obj), then iterate through Object.values(obj) and recursively call deepFreeze if value is an object and not null.`,
  starterCode: `// obj1.js
function deepFreeze(obj) {
  // TODO: Freeze obj and all its nested objects recursively
  return obj;
}

test("deeply freezes nested objects", () => {
  const config = {
    app: {
      name: "Scripter",
      meta: { version: "1.0" }
    }
  };

  deepFreeze(config);

  expect(Object.isFrozen(config)).toBe(true);
  expect(Object.isFrozen(config.app)).toBe(true);
  expect(Object.isFrozen(config.app.meta)).toBe(true);
});
`,
  solutionCode: `// obj1.js solution
function deepFreeze(obj) {
  Object.freeze(obj);
  for (const val of Object.values(obj)) {
    if (val && typeof val === 'object' && !Object.isFrozen(val)) {
      deepFreeze(val);
    }
  }
  return obj;
}

test("deeply freezes nested objects", () => {
  const config = {
    app: {
      name: "Scripter",
      meta: { version: "1.0" }
    }
  };

  deepFreeze(config);

  expect(Object.isFrozen(config)).toBe(true);
  expect(Object.isFrozen(config.app)).toBe(true);
  expect(Object.isFrozen(config.app.meta)).toBe(true);
});
`,
});

// ============================================================================
// MODULE 07: Strings & Regular Expressions
// ============================================================================
const mod07Readme = `# Strings & Regular Expressions

Strings represent textual data. Regular expressions provide robust pattern matching.

## Key Concepts
- **Tagged Template Literals**: Functions placed before a template literal \`tag\`string\${val}\`\` receiving string pieces and interpolated values.
- **Capture Groups**: Parenthesized patterns in regex that extract sub-matches.
- **Named Capture Groups**: \`(?<groupName>pattern)\` allowing extraction by name in \`match.groups\`.`;

addExercise({
  id: 'str1',
  title: 'Tagged Template Literals',
  category: '07_strings_regex',
  categoryTitle: 'Strings & Regular Expressions',
  categoryOrder: 7,
  categoryReadme: mod07Readme,
  path: 'exercises/07_strings_regex/str1.js',
  filename: 'str1.js',
  language: 'javascript',
  mode: 'test',
  instructions: `str1.js

Implement the tagged template literal 'highlight' that wraps every interpolated expression in '<mark>...</mark>' tags, returning the combined string.`,
  hint: `A tag function receives (strings, ...values). Interleave strings[i] with '<mark>' + values[i] + '</mark>'.`,
  starterCode: `// str1.js
function highlight(strings, ...values) {
  // TODO: Build and return string wrapping each interpolated value in <mark></mark>
  return "";
}

test("formats interpolated values with mark tags", () => {
  const user = "Alice";
  const points = 100;
  const result = highlight\`User \${user} has \${points} points!\`;
  expect(result).toBe("User <mark>Alice</mark> has <mark>100</mark> points!");
});
`,
  solutionCode: `// str1.js solution
function highlight(strings, ...values) {
  let result = "";
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      result += \`<mark>\${values[i]}</mark>\`;
    }
  }
  return result;
}

test("formats interpolated values with mark tags", () => {
  const user = "Alice";
  const points = 100;
  const result = highlight\`User \${user} has \${points} points!\`;
  expect(result).toBe("User <mark>Alice</mark> has <mark>100</mark> points!");
});
`,
});

// ============================================================================
// MODULE 08: Collections (Map & Set)
// ============================================================================
const mod08Readme = `# Collections: Map, Set, WeakMap, WeakSet

JavaScript keyed collections offer distinct performance characteristics and capability over plain objects.

## Key Concepts
- **\`Set\`**: Collection of unique values of any type.
- **\`Map\`**: Key-value pairs where keys can be of any type (including functions, objects, and primitives). Preserves insertion order.
- **\`WeakMap\` / \`WeakSet\`**: Holds weak references to object keys, allowing automatic garbage collection when objects lose external references.`;

addExercise({
  id: 'coll1',
  title: 'Set Operations (Union and Intersection)',
  category: '08_collections',
  categoryTitle: 'Collections (Map & Set)',
  categoryOrder: 8,
  categoryReadme: mod08Readme,
  path: 'exercises/08_collections/coll1.js',
  filename: 'coll1.js',
  language: 'javascript',
  mode: 'test',
  instructions: `coll1.js

Implement 'intersectSets(setA, setB)' returning a new Set with elements present in both sets, and 'unionSets(setA, setB)' returning a Set of all elements from both.`,
  hint: `For intersect: new Set([...setA].filter(x => setB.has(x))). For union: new Set([...setA, ...setB]).`,
  starterCode: `// coll1.js
function intersectSets(setA, setB) {
  // TODO: Return a Set with common elements
  return new Set();
}

function unionSets(setA, setB) {
  // TODO: Return a Set with union of elements
  return new Set();
}

test("computes set intersections and unions", () => {
  const a = new Set([1, 2, 3, 4]);
  const b = new Set([3, 4, 5, 6]);

  const intersection = intersectSets(a, b);
  expect([...intersection].sort()).toEqual([3, 4]);

  const union = unionSets(a, b);
  expect([...union].sort()).toEqual([1, 2, 3, 4, 5, 6]);
});
`,
  solutionCode: `// coll1.js solution
function intersectSets(setA, setB) {
  return new Set([...setA].filter(x => setB.has(x)));
}

function unionSets(setA, setB) {
  return new Set([...setA, ...setB]);
}

test("computes set intersections and unions", () => {
  const a = new Set([1, 2, 3, 4]);
  const b = new Set([3, 4, 5, 6]);

  const intersection = intersectSets(a, b);
  expect([...intersection].sort()).toEqual([3, 4]);

  const union = unionSets(a, b);
  expect([...union].sort()).toEqual([1, 2, 3, 4, 5, 6]);
});
`,
});

// ============================================================================
// MODULE 09: Error Handling
// ============================================================================
const mod09Readme = `# Error Handling in JavaScript

Robust applications anticipate and gracefully handle runtime errors.

## Key Concepts
- **\`try...catch...finally\`**: The \`finally\` block executes regardless of whether an exception was thrown.
- **Custom Errors**: Subclassing \`Error\` preserves stack traces and allows \`instanceof\` error discrimination.
- **Error Cause**: \`new Error(msg, { cause: originalError })\` chains exceptions.`;

addExercise({
  id: 'err1',
  title: 'Custom Application Error Hierarchy',
  category: '09_error_handling',
  categoryTitle: 'Error Handling',
  categoryOrder: 9,
  categoryReadme: mod09Readme,
  path: 'exercises/09_error_handling/err1.js',
  filename: 'err1.js',
  language: 'javascript',
  mode: 'test',
  instructions: `err1.js

Create a custom error class 'ValidationError' that extends 'Error'. It should:
1. Accept 'message' and 'field'
2. Set 'this.name = "ValidationError"'
3. Set 'this.field = field'`,
  hint: `class ValidationError extends Error { constructor(message, field) { super(message); this.name = "ValidationError"; this.field = field; } }`,
  starterCode: `// err1.js
// TODO: Define ValidationError extending Error
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    // TODO: Set name and field
  }
}

function validateAge(age) {
  if (typeof age !== 'number' || age < 0) {
    throw new ValidationError("Age must be a positive number", "age");
  }
  return true;
}

test("throws and identifies custom ValidationError", () => {
  expect(() => validateAge(-5)).toThrow("Age must be a positive number");

  try {
    validateAge(-5);
  } catch (err) {
    expect(err instanceof ValidationError).toBe(true);
    expect(err instanceof Error).toBe(true);
    expect(err.name).toBe("ValidationError");
    expect(err.field).toBe("age");
  }
});
`,
  solutionCode: `// err1.js solution
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

function validateAge(age) {
  if (typeof age !== 'number' || age < 0) {
    throw new ValidationError("Age must be a positive number", "age");
  }
  return true;
}

test("throws and identifies custom ValidationError", () => {
  expect(() => validateAge(-5)).toThrow("Age must be a positive number");

  try {
    validateAge(-5);
  } catch (err) {
    expect(err instanceof ValidationError).toBe(true);
    expect(err instanceof Error).toBe(true);
    expect(err.name).toBe("ValidationError");
    expect(err.field).toBe("age");
  }
});
`,
});

// ============================================================================
// MODULE 10: Closures & Lexical Scope (JS Advanced)
// ============================================================================
const mod10Readme = `# Closures & Lexical Scope

A closure gives an inner function access to its outer function's scope even after the outer function has returned.

## Key Concepts
- **Lexical Scope**: Scope resolution is determined by variable location in source code at author time.
- **Data Encapsulation**: Private variables inaccessible from outside code.
- **Memoization**: Storing computed results indexed by argument keys to avoid redundant work.`;

addExercise({
  id: 'closure1',
  title: 'Memoization with Closures',
  category: '10_closures_scope',
  categoryTitle: 'Closures & Scope',
  categoryOrder: 10,
  categoryReadme: mod10Readme,
  path: 'exercises/10_closures_scope/closure1.js',
  filename: 'closure1.js',
  language: 'javascript',
  mode: 'test',
  instructions: `closure1.js

Implement 'memoize(fn)' which caches the output of function 'fn' for arguments. If called with previously seen arguments, it returns the cached result without invoking 'fn' again.`,
  hint: `Use a Map or object cache inside memoize. Key by JSON.stringify(args). Check cache.has(key).`,
  starterCode: `// closure1.js
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    // TODO: Return cached value if args seen before, otherwise compute and cache
    return fn(...args);
  };
}

test("caches results and prevents redundant function executions", () => {
  let callCount = 0;
  const expensiveAdd = (a, b) => {
    callCount++;
    return a + b;
  };

  const memoized = memoize(expensiveAdd);

  expect(memoized(2, 3)).toBe(5);
  expect(memoized(2, 3)).toBe(5);
  expect(callCount).toBe(1); // Only called once!

  expect(memoized(4, 5)).toBe(9);
  expect(callCount).toBe(2);
});
`,
  solutionCode: `// closure1.js solution
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

test("caches results and prevents redundant function executions", () => {
  let callCount = 0;
  const expensiveAdd = (a, b) => {
    callCount++;
    return a + b;
  };

  const memoized = memoize(expensiveAdd);

  expect(memoized(2, 3)).toBe(5);
  expect(memoized(2, 3)).toBe(5);
  expect(callCount).toBe(1);

  expect(memoized(4, 5)).toBe(9);
  expect(callCount).toBe(2);
});
`,
});

// ============================================================================
// MODULE 11: Prototypes & Classes (JS Advanced)
// ============================================================================
const mod11Readme = `# Prototypes & Class Inheritance

JavaScript uses prototypal inheritance: objects inherit directly from other objects via a prototype chain.

## Key Concepts
- **\`Object.create(proto)\`**: Creates a new object with the specified prototype object.
- **ES6 Classes**: Syntactic sugar over prototype chains with \`constructor\`, \`super\`, and class methods.
- **Private Class Fields**: Prefixed with \`#\` (e.g. \`#secret\`), hard-private and inaccessible outside class body.`;

addExercise({
  id: 'proto1',
  title: 'Class Inheritance and Super Call',
  category: '11_prototypes_classes',
  categoryTitle: 'Prototypes & Classes',
  categoryOrder: 11,
  categoryReadme: mod11Readme,
  path: 'exercises/11_prototypes_classes/proto1.js',
  filename: 'proto1.js',
  language: 'javascript',
  mode: 'test',
  instructions: `proto1.js

Implement a 'BankAccount' class and a derived 'SavingsAccount' class:
1. BankAccount has private field '#balance' initialized in constructor with initialBalance.
2. Provide getter 'balance' returning current balance, and 'deposit(amount)'.
3. SavingsAccount extends BankAccount and adds 'applyInterest(rate)' multiplying balance by (1 + rate).`,
  hint: `class SavingsAccount extends BankAccount { applyInterest(rate) { this.deposit(this.balance * rate); } }`,
  starterCode: `// proto1.js
class BankAccount {
  #balance = 0;

  constructor(initialBalance = 0) {
    this.#balance = initialBalance;
  }

  get balance() {
    return this.#balance;
  }

  deposit(amount) {
    this.#balance += amount;
  }
}

// TODO: Create SavingsAccount extending BankAccount
class SavingsAccount extends BankAccount {
  applyInterest(rate) {
    // TODO: Add interest to balance (interest = this.balance * rate)
  }
}

test("implements class inheritance and methods", () => {
  const account = new SavingsAccount(100);
  account.deposit(50);
  expect(account.balance).toBe(150);

  account.applyInterest(0.1); // 10% on 150 = 15 -> 165
  expect(account.balance).toBe(165);
});
`,
  solutionCode: `// proto1.js solution
class BankAccount {
  #balance = 0;

  constructor(initialBalance = 0) {
    this.#balance = initialBalance;
  }

  get balance() {
    return this.#balance;
  }

  deposit(amount) {
    this.#balance += amount;
  }
}

class SavingsAccount extends BankAccount {
  applyInterest(rate) {
    this.deposit(this.balance * rate);
  }
}

test("implements class inheritance and methods", () => {
  const account = new SavingsAccount(100);
  account.deposit(50);
  expect(account.balance).toBe(150);

  account.applyInterest(0.1);
  expect(account.balance).toBe(165);
});
`,
});

// ============================================================================
// MODULE 12: this Context & Binding (JS Advanced)
// ============================================================================
const mod12Readme = `# The 'this' Keyword & Context Binding

In JavaScript, 'this' refers to the execution context of a function call.

## Key Concepts
- **Implicit Binding**: When an object method is called as \`obj.method()\`, \`this\` is \`obj\`.
- **Explicit Binding**: \`call(thisArg, ...args)\`, \`apply(thisArg, [args])\`, \`bind(thisArg, ...args)\`.
- **Arrow Functions**: Retain the \`this\` value of the enclosing lexical scope and cannot be rebound.`;

addExercise({
  id: 'this1',
  title: 'Explicit Function Binding Polyfill',
  category: '12_this_context',
  categoryTitle: 'The this Keyword',
  categoryOrder: 12,
  categoryReadme: mod12Readme,
  path: 'exercises/12_this_context/this1.js',
  filename: 'this1.js',
  language: 'javascript',
  mode: 'test',
  instructions: `this1.js

Implement a custom bind helper 'customBind(fn, context, ...boundArgs)' that returns a new function executing 'fn' with 'context' as its 'this' and combining boundArgs with call-time arguments.`,
  hint: `return function(...callArgs) { return fn.apply(context, [...boundArgs, ...callArgs]); }`,
  starterCode: `// this1.js
function customBind(fn, context, ...boundArgs) {
  // TODO: Return bound function executing fn with context as 'this'
  return function(...args) {};
}

test("binds function context and prepends arguments", () => {
  const user = { name: "Alice" };

  function greet(greeting, punctuation) {
    return \`\${greeting}, \${this.name}\${punctuation}\`;
  }

  const greetAlice = customBind(greet, user, "Hello");
  expect(greetAlice("!")).toBe("Hello, Alice!");
});
`,
  solutionCode: `// this1.js solution
function customBind(fn, context, ...boundArgs) {
  return function(...callArgs) {
    return fn.apply(context, [...boundArgs, ...callArgs]);
  };
}

test("binds function context and prepends arguments", () => {
  const user = { name: "Alice" };

  function greet(greeting, punctuation) {
    return \`\${greeting}, \${this.name}\${punctuation}\`;
  }

  const greetAlice = customBind(greet, user, "Hello");
  expect(greetAlice("!")).toBe("Hello, Alice!");
});
`,
});

// ============================================================================
// MODULE 13: Asynchronous JS & Promises (JS Advanced)
// ============================================================================
const mod13Readme = `# Asynchronous JavaScript & Promises

JavaScript handles asynchronous operations using non-blocking event-driven concurrency.

## Key Concepts
- **Promises**: Objects representing the eventual completion (or failure) of an async operation.
- **\`async\` / \`await\`**: Declarative syntax sugar over Promises.
- **Promise Combinators**:
  - \`Promise.all\`: Fails fast if any promise rejects.
  - \`Promise.allSettled\`: Waits for all promises to resolve or reject, returning status objects.
  - \`Promise.race\`: Settles with the first settled promise.`;

addExercise({
  id: 'async1',
  title: 'Async Retry with Exponential Backoff',
  category: '13_async_promises',
  categoryTitle: 'Asynchronous JS & Promises',
  categoryOrder: 13,
  categoryReadme: mod13Readme,
  path: 'exercises/13_async_promises/async1.js',
  filename: 'async1.js',
  language: 'javascript',
  mode: 'test',
  instructions: `async1.js

Implement 'retryAsync(fn, maxRetries)' that executes async function 'fn'. If 'fn' throws an error, retry up to 'maxRetries' times. If it still fails, throw the final error.`,
  hint: `Use a for loop: for (let attempt = 0; attempt <= maxRetries; attempt++) { try { return await fn(); } catch(err) { if (attempt === maxRetries) throw err; } }`,
  starterCode: `// async1.js
async function retryAsync(fn, maxRetries = 3) {
  // TODO: Retry calling fn up to maxRetries times on failure
  return await fn();
}

test("retries failing operations until success", async () => {
  let attempts = 0;
  const unstableTask = async () => {
    attempts++;
    if (attempts < 3) throw new Error("Temporary network glitch");
    return "SUCCESS";
  };

  const result = await retryAsync(unstableTask, 4);
  expect(result).toBe("SUCCESS");
  expect(attempts).toBe(3);
});
`,
  solutionCode: `// async1.js solution
async function retryAsync(fn, maxRetries = 3) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

test("retries failing operations until success", async () => {
  let attempts = 0;
  const unstableTask = async () => {
    attempts++;
    if (attempts < 3) throw new Error("Temporary network glitch");
    return "SUCCESS";
  };

  const result = await retryAsync(unstableTask, 4);
  expect(result).toBe("SUCCESS");
  expect(attempts).toBe(3);
});
`,
});

// ============================================================================
// MODULE 14: Event Loop & Timers (JS Advanced)
// ============================================================================
const mod14Readme = `# Event Loop, Debounce & Throttle

JavaScript runs on a single-threaded event loop with task queues.

## Key Concepts
- **Microtasks**: \`Promise.then\`, \`queueMicrotask\`. Executed immediately after current JS execution before any macrotasks or UI rendering.
- **Macrotasks**: \`setTimeout\`, \`setInterval\`, I/O.
- **Debounce**: Delays function execution until a period of inactivity has elapsed.
- **Throttle**: Ensures a function is called at most once every N milliseconds.`;

addExercise({
  id: 'eventloop1',
  title: 'Debounce Function with Immediate Execution',
  category: '14_event_loop',
  categoryTitle: 'Event Loop & Timers',
  categoryOrder: 14,
  categoryReadme: mod14Readme,
  path: 'exercises/14_event_loop/eventloop1.js',
  filename: 'eventloop1.js',
  language: 'javascript',
  mode: 'test',
  instructions: `eventloop1.js

Implement 'debounce(fn, delay)' that postpones calling 'fn' until 'delay' milliseconds have elapsed since the last time the debounced function was invoked. Include a '.cancel()' method on the returned function.`,
  hint: `let timer; const debounced = (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; debounced.cancel = () => clearTimeout(timer); return debounced;`,
  starterCode: `// eventloop1.js
function debounce(fn, delay) {
  let timerId = null;

  function debounced(...args) {
    // TODO: Reset timer and schedule fn call
  }

  debounced.cancel = function() {
    // TODO: Clear active timer
  };

  return debounced;
}

test("debounces calls and allows cancellation", async () => {
  let counter = 0;
  const inc = () => counter++;
  const debouncedInc = debounce(inc, 50);

  debouncedInc();
  debouncedInc();
  debouncedInc();

  // Active timer will be cancelled
  debouncedInc.cancel();

  await new Promise(r => setTimeout(r, 60));
  expect(counter).toBe(0); // cancelled, never ran
});
`,
  solutionCode: `// eventloop1.js solution
function debounce(fn, delay) {
  let timerId = null;

  function debounced(...args) {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  }

  debounced.cancel = function() {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  return debounced;
}

test("debounces calls and allows cancellation", async () => {
  let counter = 0;
  const inc = () => counter++;
  const debouncedInc = debounce(inc, 50);

  debouncedInc();
  debouncedInc();
  debouncedInc();

  debouncedInc.cancel();

  await new Promise(r => setTimeout(r, 60));
  expect(counter).toBe(0);
});
`,
});

// ============================================================================
// MODULE 15: Iterators & Generators (JS Advanced)
// ============================================================================
const mod15Readme = `# Iterators & Generators

Iterators provide a standardized interface for sequential value access.

## Key Concepts
- **Iterable Protocol**: An object is iterable if it implements \`[Symbol.iterator]()\` returning an iterator.
- **Iterator Protocol**: An object with a \`next()\` method returning \`{ value, done }\`.
- **Generators (\`function*\`)**: Functions that can be paused (\`yield\`) and resumed on demand.`;

addExercise({
  id: 'iter1',
  title: 'Range Generator',
  category: '15_iterators_generators',
  categoryTitle: 'Iterators & Generators',
  categoryOrder: 15,
  categoryReadme: mod15Readme,
  path: 'exercises/15_iterators_generators/iter1.js',
  filename: 'iter1.js',
  language: 'javascript',
  mode: 'test',
  instructions: `iter1.js

Implement a generator function 'range(start, end, step = 1)' that yields numbers from start up to (but not including) end.`,
  hint: `for (let i = start; i < end; i += step) { yield i; }`,
  starterCode: `// iter1.js
function* range(start, end, step = 1) {
  // TODO: Yield numbers from start to end
}

test("yields sequence of numbers in range", () => {
  const nums = [...range(0, 5)];
  expect(nums).toEqual([0, 1, 2, 3, 4]);

  const evens = [...range(2, 10, 2)];
  expect(evens).toEqual([2, 4, 6, 8]);
});
`,
  solutionCode: `// iter1.js solution
function* range(start, end, step = 1) {
  for (let i = start; i < end; i += step) {
    yield i;
  }
}

test("yields sequence of numbers in range", () => {
  const nums = [...range(0, 5)];
  expect(nums).toEqual([0, 1, 2, 3, 4]);

  const evens = [...range(2, 10, 2)];
  expect(evens).toEqual([2, 4, 6, 8]);
});
`,
});

// ============================================================================
// MODULE 16: Metaprogramming (Proxy & Reflect)
// ============================================================================
const mod16Readme = `# Metaprogramming: Proxy & Reflect

Proxies enable interception and custom behavior for fundamental object operations.

## Key Concepts
- **\`Proxy\`**: Wraps a target object with custom handlers ('traps') for operations like \`get\`, \`set\`, \`deleteProperty\`.
- **\`Reflect\`**: Standard API for forwarding intercepted operations to default JavaScript semantics.`;

addExercise({
  id: 'meta1',
  title: 'Reactive Property Proxy',
  category: '16_metaprogramming',
  categoryTitle: 'Metaprogramming (Proxy & Reflect)',
  categoryOrder: 16,
  categoryReadme: mod16Readme,
  path: 'exercises/16_metaprogramming/meta1.js',
  filename: 'meta1.js',
  language: 'javascript',
  mode: 'test',
  instructions: `meta1.js

Implement 'createObservable(target, onChange)' returning a Proxy wrapping 'target'. Whenever any property on the proxy is set, invoke 'onChange(property, newValue, oldValue)'.`,
  hint: `Use Reflect.get(target, prop) to get old value, Reflect.set(target, prop, value) to update, then call onChange(prop, value, oldVal). Return true.`,
  starterCode: `// meta1.js
function createObservable(target, onChange) {
  // TODO: Return a Proxy intercepting set operations and notifying onChange
  return target;
}

test("notifies listener on property changes via Proxy", () => {
  const changes = [];
  const state = createObservable({ count: 0 }, (prop, next, prev) => {
    changes.push({ prop, next, prev });
  });

  state.count = 1;
  state.count = 5;

  expect(state.count).toBe(5);
  expect(changes).toEqual([
    { prop: "count", next: 1, prev: 0 },
    { prop: "count", next: 5, prev: 1 }
  ]);
});
`,
  solutionCode: `// meta1.js solution
function createObservable(target, onChange) {
  return new Proxy(target, {
    set(obj, prop, value) {
      const prev = obj[prop];
      obj[prop] = value;
      onChange(prop, value, prev);
      return true;
    }
  });
}

test("notifies listener on property changes via Proxy", () => {
  const changes = [];
  const state = createObservable({ count: 0 }, (prop, next, prev) => {
    changes.push({ prop, next, prev });
  });

  state.count = 1;
  state.count = 5;

  expect(state.count).toBe(5);
  expect(changes).toEqual([
    { prop: "count", next: 1, prev: 0 },
    { prop: "count", next: 5, prev: 1 }
  ]);
});
`,
});

// ============================================================================
// MODULE 17: TypeScript Basics - Primitives & Tuples
// ============================================================================
const mod17Readme = `# TypeScript Primitives & Tuples

TypeScript adds a static type system on top of JavaScript.

## Key Concepts
- **Primitives**: \`string\`, \`number\`, \`boolean\`, \`bigint\`, \`symbol\`, \`null\`, \`undefined\`.
- **Tuples**: Fixed-length arrays with specific element types at each position (e.g. \`[string, number]\`).
- **\`unknown\`**: The type-safe counterpart of \`any\`. You must narrow \`unknown\` before performing operations on it.`;

addExercise({
  id: 'ts_types1',
  title: 'Tuples and Type Annotations',
  category: '17_ts_primitives',
  categoryTitle: 'TypeScript Primitives & Tuples',
  categoryOrder: 17,
  categoryReadme: mod17Readme,
  path: 'exercises/17_ts_primitives/types1.ts',
  filename: 'types1.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `types1.ts

Declare the type 'Coordinate' as a 2D tuple of numbers [latitude, longitude].
Implement 'formatCoordinate(coord: Coordinate): string' returning 'Lat: {lat}, Lng: {lng}'.`,
  hint: `type Coordinate = [number, number]; const [lat, lng] = coord;`,
  starterCode: `// types1.ts
// TODO: Define Coordinate as a tuple [latitude: number, longitude: number]
type Coordinate = [number, number];

function formatCoordinate(coord: Coordinate): string {
  // TODO: Return "Lat: X, Lng: Y"
  return "";
}

test("formats typed 2D coordinates", () => {
  const tokyo: Coordinate = [35.6762, 139.6503];
  expect(formatCoordinate(tokyo)).toBe("Lat: 35.6762, Lng: 139.6503");
});
`,
  solutionCode: `// types1.ts solution
type Coordinate = [number, number];

function formatCoordinate(coord: Coordinate): string {
  return \`Lat: \${coord[0]}, Lng: \${coord[1]}\`;
}

test("formats typed 2D coordinates", () => {
  const tokyo: Coordinate = [35.6762, 139.6503];
  expect(formatCoordinate(tokyo)).toBe("Lat: 35.6762, Lng: 139.6503");
});
`,
});

// ============================================================================
// MODULE 18: TypeScript Interfaces & Types
// ============================================================================
const mod18Readme = `# Interfaces & Type Aliases

Interfaces define contracts in TypeScript.

## Key Concepts
- **\`interface\` vs \`type\`**: Interfaces can be extended with \`extends\` and merged. Types can model unions, intersections, and mapped types.
- **Optional Properties (\`?\`)**: Properties that may be undefined.
- **Readonly Properties**: \`readonly id: string\` prevents reassignment after initialization.`;

addExercise({
  id: 'ts_interface1',
  title: 'Extending Interfaces',
  category: '18_ts_interfaces_types',
  categoryTitle: 'Interfaces & Type Aliases',
  categoryOrder: 18,
  categoryReadme: mod18Readme,
  path: 'exercises/18_ts_interfaces_types/interface1.ts',
  filename: 'interface1.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `interface1.ts

Define interface 'User' with 'id: string' and 'name: string'.
Define interface 'AdminUser' extending 'User' with additional property 'permissions: string[]'.
Implement 'hasPermission(admin: AdminUser, perm: string): boolean'.`,
  hint: `interface AdminUser extends User { permissions: string[]; } admin.permissions.includes(perm);`,
  starterCode: `// interface1.ts
interface User {
  id: string;
  name: string;
}

// TODO: Create AdminUser extending User with permissions: string[]
interface AdminUser extends User {
  permissions: string[];
}

function hasPermission(admin: AdminUser, perm: string): boolean {
  // TODO: Check if admin has the requested permission
  return false;
}

test("validates user interface extension", () => {
  const admin: AdminUser = {
    id: "u1",
    name: "Bashar",
    permissions: ["READ", "WRITE", "DELETE"]
  };

  expect(hasPermission(admin, "WRITE")).toBe(true);
  expect(hasPermission(admin, "DEPLOY")).toBe(false);
});
`,
  solutionCode: `// interface1.ts solution
interface User {
  id: string;
  name: string;
}

interface AdminUser extends User {
  permissions: string[];
}

function hasPermission(admin: AdminUser, perm: string): boolean {
  return admin.permissions.includes(perm);
}

test("validates user interface extension", () => {
  const admin: AdminUser = {
    id: "u1",
    name: "Bashar",
    permissions: ["READ", "WRITE", "DELETE"]
  };

  expect(hasPermission(admin, "WRITE")).toBe(true);
  expect(hasPermission(admin, "DEPLOY")).toBe(false);
});
`,
});

// ============================================================================
// MODULE 19: TypeScript Unions & Type Narrowing
// ============================================================================
const mod19Readme = `# Unions & Type Narrowing

Unions allow values to be one of multiple types. Type narrowing refines a broad type into a specific one.

## Key Concepts
- **Discriminated Unions**: Objects sharing a literal discriminant property (e.g. \`type: 'circle' | 'square'\`).
- **Type Guards**: \`typeof\`, \`instanceof\`, \`in\`, or custom predicates (\`x is SpecialType\`).
- **Exhaustiveness Checking**: Using \`never\` in the default case of a switch to ensure all union variants are handled.`;

addExercise({
  id: 'ts_narrow1',
  title: 'Discriminated Unions & Pattern Matching',
  category: '19_ts_unions_narrowing',
  categoryTitle: 'Unions & Type Narrowing',
  categoryOrder: 19,
  categoryReadme: mod19Readme,
  path: 'exercises/19_ts_unions_narrowing/narrow1.ts',
  filename: 'narrow1.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `narrow1.ts

Given the discriminated union 'Shape', complete the 'computeArea(shape: Shape): number' function.
- Circle: Math.PI * radius^2
- Rectangle: width * height`,
  hint: `switch (shape.kind) { case 'circle': return Math.PI * shape.radius ** 2; case 'rectangle': return shape.width * shape.height; }`,
  starterCode: `// narrow1.ts
interface Circle {
  kind: 'circle';
  radius: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

type Shape = Circle | Rectangle;

function computeArea(shape: Shape): number {
  // TODO: Use shape.kind to calculate and return exact area
  return 0;
}

test("computes area with discriminated union narrowing", () => {
  const circle: Shape = { kind: 'circle', radius: 10 };
  const rect: Shape = { kind: 'rectangle', width: 5, height: 4 };

  expect(Math.round(computeArea(circle))).toBe(314);
  expect(computeArea(rect)).toBe(20);
});
`,
  solutionCode: `// narrow1.ts solution
interface Circle {
  kind: 'circle';
  radius: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

type Shape = Circle | Rectangle;

function computeArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius * shape.radius;
    case 'rectangle':
      return shape.width * shape.height;
  }
}

test("computes area with discriminated union narrowing", () => {
  const circle: Shape = { kind: 'circle', radius: 10 };
  const rect: Shape = { kind: 'rectangle', width: 5, height: 4 };

  expect(Math.round(computeArea(circle))).toBe(314);
  expect(computeArea(rect)).toBe(20);
});
`,
});

// ============================================================================
// MODULE 20: TypeScript Functions & Overloads
// ============================================================================
const mod20Readme = `# Functions & Overloading in TypeScript

TypeScript allows defining multiple function signatures to model functions that behave differently based on arguments.

## Key Concepts
- **Overload Signatures**: Declare the external API signatures of a function.
- **Implementation Signature**: The single function body that handles all overload cases (must be compatible with all overloads).`;

addExercise({
  id: 'ts_fn1',
  title: 'Function Overloading',
  category: '20_ts_functions',
  categoryTitle: 'Functions & Overloads',
  categoryOrder: 20,
  categoryReadme: mod20Readme,
  path: 'exercises/20_ts_functions/fn1.ts',
  filename: 'fn1.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `fn1.ts

Implement the function 'formatDate':
- When given a timestamp (number), returns an ISO string.
- When given a Date instance, returns an ISO string.`,
  hint: `function formatDate(val: number | Date): string { return new Date(val).toISOString(); }`,
  starterCode: `// fn1.ts
function formatDate(timestamp: number): string;
function formatDate(date: Date): string;
function formatDate(val: number | Date): string {
  // TODO: Return val as ISO string
  return "";
}

test("handles overloaded date formats", () => {
  const d = new Date("2026-01-01T00:00:00.000Z");
  expect(formatDate(d)).toBe("2026-01-01T00:00:00.000Z");
  expect(formatDate(d.getTime())).toBe("2026-01-01T00:00:00.000Z");
});
`,
  solutionCode: `// fn1.ts solution
function formatDate(timestamp: number): string;
function formatDate(date: Date): string;
function formatDate(val: number | Date): string {
  return new Date(val).toISOString();
}

test("handles overloaded date formats", () => {
  const d = new Date("2026-01-01T00:00:00.000Z");
  expect(formatDate(d)).toBe("2026-01-01T00:00:00.000Z");
  expect(formatDate(d.getTime())).toBe("2026-01-01T00:00:00.000Z");
});
`,
});

// ============================================================================
// MODULE 21: TypeScript Classes & Enums
// ============================================================================
const mod21Readme = `# Classes & Enums in TypeScript

TypeScript extends JavaScript classes with visibility modifiers and enum types.

## Key Concepts
- **Visibility Modifiers**: \`public\` (default), \`protected\` (accessible within subclasses), \`private\` (compile-time private).
- **Parameter Properties**: Declaring visibility on constructor arguments automatically creates and assigns instance fields.
- **Const Assertions (\`as const\`)**: Often preferred over numeric enums for zero-runtime overhead and literal type safety.`;

addExercise({
  id: 'ts_class1',
  title: 'Parameter Properties and Readonly Fields',
  category: '21_ts_classes_enums',
  categoryTitle: 'Classes & Enums',
  categoryOrder: 21,
  categoryReadme: mod21Readme,
  path: 'exercises/21_ts_classes_enums/class1.ts',
  filename: 'class1.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `class1.ts

Create a class 'Product' with:
- \`public readonly id: string\`
- \`public title: string\`
- \`private price: number\`
Use constructor parameter properties to declare and initialize all three in a single line! Provide method \`getPrice(): number\`.`,
  hint: `constructor(public readonly id: string, public title: string, private price: number) {}`,
  starterCode: `// class1.ts
class Product {
  // TODO: Use constructor parameter properties for id (readonly), title, and price (private)
  constructor(id: string, title: string, price: number) {}

  getPrice(): number {
    return 0;
  }
}

test("instantiates class with parameter properties", () => {
  const p = new Product("prod-1", "Mechanical Keyboard", 120);
  expect(p.id).toBe("prod-1");
  expect(p.title).toBe("Mechanical Keyboard");
  expect(p.getPrice()).toBe(120);
});
`,
  solutionCode: `// class1.ts solution
class Product {
  constructor(
    public readonly id: string,
    public title: string,
    private price: number
  ) {}

  getPrice(): number {
    return this.price;
  }
}

test("instantiates class with parameter properties", () => {
  const p = new Product("prod-1", "Mechanical Keyboard", 120);
  expect(p.id).toBe("prod-1");
  expect(p.title).toBe("Mechanical Keyboard");
  expect(p.getPrice()).toBe(120);
});
`,
});

// ============================================================================
// MODULE 22: TypeScript Generics (TS Advanced)
// ============================================================================
const mod22Readme = `# TypeScript Generics

Generics allow creating reusable components that work with a variety of types while preserving type safety.

## Key Concepts
- **Type Parameters**: \`<T>\` acts as a placeholder for types provided by the caller.
- **Generic Constraints**: \`<T extends HasId>\` restricts allowable types to those matching an interface.
- **Default Type Arguments**: \`<T = string>\` provides a fallback type when omitted.`;

addExercise({
  id: 'ts_gen1',
  title: 'Generic Stack Data Structure',
  category: '22_ts_generics',
  categoryTitle: 'TypeScript Generics',
  categoryOrder: 22,
  categoryReadme: mod22Readme,
  path: 'exercises/22_ts_generics/gen1.ts',
  filename: 'gen1.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `gen1.ts

Implement a generic class 'Stack<T>' supporting:
- \`push(item: T): void\`
- \`pop(): T | undefined\`
- \`peek(): T | undefined\`
- \`size: number\` (getter)`,
  hint: `class Stack<T> { private items: T[] = []; push(item: T) { this.items.push(item); } ... }`,
  starterCode: `// gen1.ts
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    // TODO: Add item to stack
  }

  pop(): T | undefined {
    // TODO: Remove and return top item
    return undefined;
  }

  peek(): T | undefined {
    // TODO: Return top item without removing
    return undefined;
  }

  get size(): number {
    return this.items.length;
  }
}

test("maintains generic stack operations and LIFO order", () => {
  const numStack = new Stack<number>();
  numStack.push(10);
  numStack.push(20);

  expect(numStack.size).toBe(2);
  expect(numStack.peek()).toBe(20);
  expect(numStack.pop()).toBe(20);
  expect(numStack.pop()).toBe(10);
  expect(numStack.pop()).toBeUndefined();
});
`,
  solutionCode: `// gen1.ts solution
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }
}

test("maintains generic stack operations and LIFO order", () => {
  const numStack = new Stack<number>();
  numStack.push(10);
  numStack.push(20);

  expect(numStack.size).toBe(2);
  expect(numStack.peek()).toBe(20);
  expect(numStack.pop()).toBe(20);
  expect(numStack.pop()).toBe(10);
  expect(numStack.pop()).toBeUndefined();
});
`,
});

// ============================================================================
// MODULE 23: Keyof & Lookup Types (TS Advanced)
// ============================================================================
const mod23Readme = `# Keyof & Indexed Access Types

The \`keyof\` operator and indexed access types enable safe property access across generic types.

## Key Concepts
- **\`keyof T\`**: Produces a union of known, public property names of type \`T\`.
- **\`T[K]\`**: Look up the type of property \`K\` on type \`T\`.
- **Safe Property Access**: Combining \`<T, K extends keyof T>(obj: T, key: K): T[K]\`.`;

addExercise({
  id: 'ts_lookup1',
  title: 'Type-Safe Property Pluck',
  category: '23_ts_lookup_types',
  categoryTitle: 'Keyof & Lookup Types',
  categoryOrder: 23,
  categoryReadme: mod23Readme,
  path: 'exercises/23_ts_lookup_types/lookup1.ts',
  filename: 'lookup1.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `lookup1.ts

Implement the generic function 'pluck<T, K extends keyof T>(items: T[], key: K): T[K][]' that extracts the value of 'key' from each object in an array.`,
  hint: `return items.map(item => item[key]);`,
  starterCode: `// lookup1.ts
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  // TODO: Return array of property values for the given key
  return [];
}

test("plucks typed property from list of objects", () => {
  const users = [
    { id: 1, name: "Alice", active: true },
    { id: 2, name: "Bob", active: false },
  ];

  const names = pluck(users, "name");
  expect(names).toEqual(["Alice", "Bob"]);

  const ids = pluck(users, "id");
  expect(ids).toEqual([1, 2]);
});
`,
  solutionCode: `// lookup1.ts solution
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map(item => item[key]);
}

test("plucks typed property from list of objects", () => {
  const users = [
    { id: 1, name: "Alice", active: true },
    { id: 2, name: "Bob", active: false },
  ];

  const names = pluck(users, "name");
  expect(names).toEqual(["Alice", "Bob"]);

  const ids = pluck(users, "id");
  expect(ids).toEqual([1, 2]);
});
`,
});

// ============================================================================
// MODULE 24: Conditional & Mapped Types (TS Advanced)
// ============================================================================
const mod24Readme = `# Conditional & Mapped Types

Mapped types and conditional types generate new types by transforming existing ones.

## Key Concepts
- **Conditional Types**: \`T extends U ? X : Y\`. When \`T\` is a naked type parameter, it distributes over union members.
- **Mapped Types**: \`{ [P in keyof T]: T[P] }\`.
- **Modifiers**: \`+readonly\`, \`-readonly\`, \`+?\`, \`-?\`.`;

addExercise({
  id: 'ts_cond1',
  title: 'Custom Deep Readonly Mapped Type',
  category: '24_ts_conditional_mapped',
  categoryTitle: 'Conditional & Mapped Types',
  categoryOrder: 24,
  categoryReadme: mod24Readme,
  path: 'exercises/24_ts_conditional_mapped/cond1.ts',
  filename: 'cond1.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `cond1.ts

Define a recursive mapped type 'DeepReadonly<T>' that makes all properties of an object and its nested objects 'readonly'.
Implement function 'freezeConfig<T>(config: T): DeepReadonly<T>'.`,
  hint: `type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] };`,
  starterCode: `// cond1.ts
// TODO: Define recursive DeepReadonly type
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

function freezeConfig<T extends object>(config: T): DeepReadonly<T> {
  // Runtime freeze
  Object.freeze(config);
  return config as DeepReadonly<T>;
}

test("freezes configuration with recursive type safety", () => {
  const config = freezeConfig({
    db: {
      host: "localhost",
      port: 5432
    }
  });

  expect(config.db.port).toBe(5432);
});
`,
  solutionCode: `// cond1.ts solution
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

function freezeConfig<T extends object>(config: T): DeepReadonly<T> {
  Object.freeze(config);
  return config as DeepReadonly<T>;
}

test("freezes configuration with recursive type safety", () => {
  const config = freezeConfig({
    db: {
      host: "localhost",
      port: 5432
    }
  });

  expect(config.db.port).toBe(5432);
});
`,
});

// ============================================================================
// MODULE 25: The infer Keyword & Utility Types (TS Advanced)
// ============================================================================
const mod25Readme = `# The infer Keyword & Advanced Utility Types

The \`infer\` keyword introduces a type variable inside a conditional type check to extract constituent types.

## Key Concepts
- **\`infer R\`**: Deduces a type within the \`extends\` clause of a conditional type.
- **Unwrapping Promises**: \`type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T\`.
- **Extracting Return Types**: \`type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never\`.`;

addExercise({
  id: 'ts_infer1',
  title: 'Type Inference with infer',
  category: '25_ts_infer_utility',
  categoryTitle: 'The infer Keyword & Utilities',
  categoryOrder: 25,
  categoryReadme: mod25Readme,
  path: 'exercises/25_ts_infer_utility/infer1.ts',
  filename: 'infer1.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `infer1.ts

Define 'UnwrapPromise<T>' using the 'infer' keyword to extract the resolved value of a Promise. If T is not a Promise, return T.`,
  hint: `type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;`,
  starterCode: `// infer1.ts
// TODO: Implement UnwrapPromise<T> with infer
type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;

async function fetchUserName(): Promise<string> {
  return "Alice";
}

test("unwraps promise type correctly", async () => {
  type ResultType = UnwrapPromise<ReturnType<typeof fetchUserName>>;
  const name: ResultType = await fetchUserName();
  expect(name).toBe("Alice");
});
`,
  solutionCode: `// infer1.ts solution
type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;

async function fetchUserName(): Promise<string> {
  return "Alice";
}

test("unwraps promise type correctly", async () => {
  type ResultType = UnwrapPromise<ReturnType<typeof fetchUserName>>;
  const name: ResultType = await fetchUserName();
  expect(name).toBe("Alice");
});
`,
});

// ============================================================================
// MODULE 26: Express Basics & Routing (Express Track)
// ============================================================================
const mod26Readme = `# Express Core & Routing

[Express](https://expressjs.com) is the fast, unopinionated, minimalist web framework for Node.js.

## Key Concepts
- **Application Instance**: Created via \`express()\`.
- **Route Handlers**: Associate HTTP verbs (\`get\`, \`post\`, \`put\`, \`delete\`) with paths.
- **Request Parameters**: \`req.params\` contains path variables (e.g. \`/users/:id\`).
- **Response Methods**: \`res.status(code)\`, \`res.json(payload)\`, \`res.send(data)\`.`;

addExercise({
  id: 'express1',
  title: 'Express REST Router',
  category: '26_express_basics',
  categoryTitle: 'Express Core & Routing',
  categoryOrder: 26,
  categoryReadme: mod26Readme,
  path: 'exercises/26_express_basics/express1.ts',
  filename: 'express1.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `express1.ts

Create an Express application 'createApp()' with the following routes:
1. 'GET /': returns status 200 with JSON { message: "Welcome to Scripter API" }
2. 'GET /users/:id': extracts 'req.params.id' and returns status 200 with JSON { userId: req.params.id }
3. 'POST /echo': echoes back the received 'req.body' with status 201.`,
  hint: `app.get('/', (req, res) => res.json({ message: "Welcome to Scripter API" })); app.get('/users/:id', (req, res) => res.json({ userId: req.params.id }));`,
  starterCode: `// express1.ts
import express from 'express';
import request from 'supertest';

export function createApp() {
  const app = express();
  app.use(express.json());

  // TODO: Add GET /
  // TODO: Add GET /users/:id
  // TODO: Add POST /echo

  return app;
}

test("handles Express routes and request parameters", async () => {
  const app = createApp();

  const res1 = await request(app).get("/").expect(200);
  expect(res1.body.message).toBe("Welcome to Scripter API");

  const res2 = await request(app).get("/users/42").expect(200);
  expect(res2.body.userId).toBe("42");

  const res3 = await request(app)
    .post("/echo")
    .send({ name: "Alice" })
    .expect(201);
  expect(res3.body.name).toBe("Alice");
});
`,
  solutionCode: `// express1.ts solution
import express from 'express';
import request from 'supertest';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to Scripter API" });
  });

  app.get('/users/:id', (req, res) => {
    res.status(200).json({ userId: req.params.id });
  });

  app.post('/echo', (req, res) => {
    res.status(201).json(req.body);
  });

  return app;
}

test("handles Express routes and request parameters", async () => {
  const app = createApp();

  const res1 = await request(app).get("/").expect(200);
  expect(res1.body.message).toBe("Welcome to Scripter API");

  const res2 = await request(app).get("/users/42").expect(200);
  expect(res2.body.userId).toBe("42");

  const res3 = await request(app)
    .post("/echo")
    .send({ name: "Alice" })
    .expect(201);
  expect(res3.body.name).toBe("Alice");
});
`,
});

// ============================================================================
// MODULE 27: Express Middleware Architecture
// ============================================================================
const mod27Readme = `# Express Middleware Architecture

Middleware functions have access to the request object (\`req\`), response object (\`res\`), and the \`next\` function in the application’s request-response cycle.

## Key Concepts
- **Middleware Signature**: \`(req, res, next) => void\`.
- **Error-Handling Middleware**: Takes four arguments: \`(err, req, res, next) => void\`.
- **Authentication Guard**: Validates tokens and aborts the pipeline with HTTP 401 Unauthorized if invalid.`;

addExercise({
  id: 'middleware1',
  title: 'Authentication & Error Middleware',
  category: '27_express_middleware',
  categoryTitle: 'Express Middleware',
  categoryOrder: 27,
  categoryReadme: mod27Readme,
  path: 'exercises/27_express_middleware/middleware1.ts',
  filename: 'middleware1.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `middleware1.ts

1. Implement 'authMiddleware': inspects 'req.headers.authorization'. If it is equal to 'Bearer secret-token', call next(). Otherwise, return status 401 with { error: "Unauthorized" }.
2. Register the protected route 'GET /protected' returning status 200 with { secretData: 12345 }.`,
  hint: `const auth = req.headers['authorization']; if (auth === 'Bearer secret-token') next(); else res.status(401).json({ error: "Unauthorized" });`,
  starterCode: `// middleware1.ts
import express from 'express';
import request from 'supertest';

export function createApp() {
  const app = express();

  const authMiddleware = (req: any, res: any, next: any) => {
    // TODO: Verify Authorization header is "Bearer secret-token"
    next();
  };

  app.get('/public', (req, res) => {
    res.json({ public: true });
  });

  // Protected route with authMiddleware
  app.get('/protected', authMiddleware, (req, res) => {
    res.json({ secretData: 12345 });
  });

  return app;
}

test("authenticates requests with Bearer token middleware", async () => {
  const app = createApp();

  await request(app).get("/public").expect(200);

  // Missing token -> 401
  const failRes = await request(app).get("/protected").expect(401);
  expect(failRes.body.error).toBe("Unauthorized");

  // Valid token -> 200
  const okRes = await request(app)
    .get("/protected")
    .set("Authorization", "Bearer secret-token")
    .expect(200);
  expect(okRes.body.secretData).toBe(12345);
});
`,
  solutionCode: `// middleware1.ts solution
import express from 'express';
import request from 'supertest';

export function createApp() {
  const app = express();

  const authMiddleware = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    if (authHeader === 'Bearer secret-token') {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  };

  app.get('/public', (req, res) => {
    res.json({ public: true });
  });

  app.get('/protected', authMiddleware, (req, res) => {
    res.json({ secretData: 12345 });
  });

  return app;
}

test("authenticates requests with Bearer token middleware", async () => {
  const app = createApp();

  await request(app).get("/public").expect(200);

  const failRes = await request(app).get("/protected").expect(401);
  expect(failRes.body.error).toBe("Unauthorized");

  const okRes = await request(app)
    .get("/protected")
    .set("Authorization", "Bearer secret-token")
    .expect(200);
  expect(okRes.body.secretData).toBe(12345);
});
`,
});

// ============================================================================
// MODULE 28: PostgreSQL Database & Transactions
// ============================================================================
const mod28Readme = `# PostgreSQL Queries, Pool & Transactions

[PostgreSQL](https://www.postgresql.org) is an advanced, enterprise-grade open-source relational database.

## Key Concepts
- **DDL & DML**: Defining tables with constraints (\`PRIMARY KEY\`, \`NOT NULL\`, \`CHECK\`) and inserting/selecting data.
- **Parameterized Queries**: Using \`$1, $2\` placeholders prevents SQL injection vulnerabilities.
- **ACID Transactions**:
  - \`BEGIN\`: Initiates a transaction block.
  - \`COMMIT\`: Persists all changes atomically.
  - \`ROLLBACK\`: Discards all changes in the event of any query failure.`;

addExercise({
  id: 'pg1',
  title: 'Postgres Transactions and Parameterized Queries',
  category: '28_postgres',
  categoryTitle: 'PostgreSQL Database',
  categoryOrder: 28,
  categoryReadme: mod28Readme,
  path: 'exercises/28_postgres/pg1.ts',
  filename: 'pg1.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `pg1.ts

Implement 'transferFunds(pool, fromAccount, toAccount, amount)':
1. Connect client via 'await pool.connect()'.
2. Execute 'BEGIN'.
3. Deduct amount from fromAccount and add amount to toAccount.
4. If fromAccount balance would become negative, ROLLBACK and throw an Error.
5. Otherwise COMMIT and return true.`,
  hint: `try { await client.query('BEGIN'); ... await client.query('COMMIT'); } catch(err) { await client.query('ROLLBACK'); throw err; }`,
  starterCode: `// pg1.ts
import { Pool } from 'pg';

export async function transferFunds(
  pool: any,
  fromId: number,
  toId: number,
  amount: number
) {
  const client = await pool.connect();
  // TODO: Run transaction with BEGIN, parameterized updates, and COMMIT/ROLLBACK
  try {
    await client.query("BEGIN");
    // TODO: transfer balance
    await client.query("COMMIT");
    return true;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
}

test("executes database queries and atomic transactions", async () => {
  const pool = new Pool();
  await pool.query("CREATE TABLE accounts (id INT PRIMARY KEY, balance INT)");
  await pool.query("INSERT INTO accounts (id, balance) VALUES ($1, $2)", [1, 500]);
  await pool.query("INSERT INTO accounts (id, balance) VALUES ($1, $2)", [2, 100]);

  const ok = await transferFunds(pool, 1, 2, 200);
  expect(ok).toBe(true);
});
`,
  solutionCode: `// pg1.ts solution
import { Pool } from 'pg';

export async function transferFunds(
  pool: any,
  fromId: number,
  toId: number,
  amount: number
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("UPDATE accounts SET balance = balance - $1 WHERE id = $2", [amount, fromId]);
    await client.query("UPDATE accounts SET balance = balance + $1 WHERE id = $2", [amount, toId]);
    await client.query("COMMIT");
    return true;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
}

test("executes database queries and atomic transactions", async () => {
  const pool = new Pool();
  await pool.query("CREATE TABLE accounts (id INT PRIMARY KEY, balance INT)");
  await pool.query("INSERT INTO accounts (id, balance) VALUES ($1, $2)", [1, 500]);
  await pool.query("INSERT INTO accounts (id, balance) VALUES ($1, $2)", [2, 100]);

  const ok = await transferFunds(pool, 1, 2, 200);
  expect(ok).toBe(true);
});
`,
});

// ============================================================================
// MODULE 29: Mongoose ODM & MongoDB
// ============================================================================
const mod29Readme = `# Mongoose ODM & MongoDB Modeling

[Mongoose](https://mongoosejs.com) provides a straight-forward, schema-based solution to model application data.

## Key Concepts
- **Schemas**: Maps to a MongoDB collection and defines the document shape.
- **Validation**: Schema-level constraints (\`required\`, \`min\`, \`max\`, custom validators).
- **Middleware (Hooks)**: \`pre('save')\` and \`post('save')\` hooks allow intercepting document lifecycle events.
- **Methods & Virtuals**: Custom instance methods and computed virtual attributes.`;

addExercise({
  id: 'mongoose1',
  title: 'Mongoose Schemas and Pre-Save Hooks',
  category: '29_mongoose',
  categoryTitle: 'Mongoose ODM',
  categoryOrder: 29,
  categoryReadme: mod29Readme,
  path: 'exercises/29_mongoose/mongoose1.ts',
  filename: 'mongoose1.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `mongoose1.ts

1. Define a 'UserSchema' with fields 'email' (String, required) and 'role' (String, default: "user").
2. Add a 'pre("save")' hook that converts 'this.email' to lowercase before saving.
3. Add a virtual getter 'isMaster' returning true if role === "admin".`,
  hint: `UserSchema.pre('save', function(next) { this.email = this.email.toLowerCase(); if (next) next(); });`,
  starterCode: `// mongoose1.ts
import mongoose from 'mongoose';

export function createUserModel() {
  const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    role: { type: String, default: "user" }
  });

  // TODO: Add pre-save hook converting email to lowercase
  // TODO: Add virtual 'isMaster' checking if role === "admin"

  return mongoose.model("User", UserSchema);
}

test("executes Mongoose hooks and virtual getters", async () => {
  const User = createUserModel();

  const user = await User.create({
    email: "JOHN.DOE@EXAMPLE.COM",
    role: "admin"
  });

  expect(user.email).toBe("john.doe@example.com");
  expect(user.isMaster).toBe(true);
});
`,
  solutionCode: `// mongoose1.ts solution
import mongoose from 'mongoose';

export function createUserModel() {
  const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    role: { type: String, default: "user" }
  });

  UserSchema.pre('save', function(next: any) {
    if (this.email) {
      this.email = this.email.toLowerCase();
    }
    if (next) next();
  });

  UserSchema.virtual('isMaster').get(function(this: any) {
    return this.role === 'admin';
  });

  return mongoose.model("User", UserSchema);
}

test("executes Mongoose hooks and virtual getters", async () => {
  const User = createUserModel();

  const user = await User.create({
    email: "JOHN.DOE@EXAMPLE.COM",
    role: "admin"
  });

  expect(user.email).toBe("john.doe@example.com");
  expect(user.isMaster).toBe(true);
});
`,
});

// ============================================================================
// MODULE 30: ElysiaJS Modern Web Framework
// ============================================================================
const mod30Readme = `# ElysiaJS Web Framework

[ElysiaJS](https://elysiajs.com) is an ergonomic, fast web framework built on standard Web APIs (Request, Response, Fetch) with end-to-end type safety via TypeBox.

## Key Concepts
- **Web Standard Foundation**: Operates seamlessly on standard Web \`Request\` and \`Response\` objects.
- **TypeBox Validation (\`t\`)**: Strict runtime type checking on \`body\`, \`query\`, and \`params\`.
- **Hooks Lifecycle**: \`onRequest\`, \`onBeforeHandle\`, \`onAfterHandle\`, \`onError\`.
- **State & Decorators**: \`.state(key, val)\` registers application state across all handlers.`;

addExercise({
  id: 'elysia1',
  title: 'ElysiaJS App and TypeBox Validation',
  category: '30_elysia',
  categoryTitle: 'ElysiaJS Web Framework',
  categoryOrder: 30,
  categoryReadme: mod30Readme,
  path: 'exercises/30_elysia/elysia1.ts',
  filename: 'elysia1.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `elysia1.ts

Create an Elysia app instance:
1. Register 'GET /health' returning "OK".
2. Register 'POST /calculate' with TypeBox body schema:
   t.Object({
     a: t.Number(),
     b: t.Number()
   })
   returning { sum: body.a + body.b }`,
  hint: `new Elysia().get('/health', () => 'OK').post('/calculate', ({ body }) => ({ sum: body.a + body.b }), { body: t.Object({ a: t.Number(), b: t.Number() }) })`,
  starterCode: `// elysia1.ts
import { Elysia, t } from 'elysia';

export function createElysiaApp() {
  const app = new Elysia();

  // TODO: Add GET /health returning "OK"
  // TODO: Add POST /calculate returning { sum: a + b } with TypeBox validation

  return app;
}

test("handles ElysiaJS routing and schema validation", async () => {
  const app = createElysiaApp();

  // Health check
  const healthRes = await app.handle(new Request("http://localhost/health"));
  expect(healthRes.status).toBe(200);
  expect(await healthRes.text()).toBe("OK");

  // Valid payload
  const calcRes = await app.handle(new Request("http://localhost/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ a: 15, b: 25 })
  }));

  expect(calcRes.status).toBe(200);
  const data = await calcRes.json();
  expect(data.sum).toBe(40);
});
`,
  solutionCode: `// elysia1.ts solution
import { Elysia, t } from 'elysia';

export function createElysiaApp() {
  return new Elysia()
    .get('/health', () => 'OK')
    .post('/calculate', ({ body }: any) => {
      return { sum: body.a + body.b };
    }, {
      body: t.Object({
        a: t.Number(),
        b: t.Number()
      })
    });
}

test("handles ElysiaJS routing and schema validation", async () => {
  const app = createElysiaApp();

  const healthRes = await app.handle(new Request("http://localhost/health"));
  expect(healthRes.status).toBe(200);
  expect(await healthRes.text()).toBe("OK");

  const calcRes = await app.handle(new Request("http://localhost/calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ a: 15, b: 25 })
  }));

  expect(calcRes.status).toBe(200);
  const data = await calcRes.json();
  expect(data.sum).toBe(40);
});
`,
});

// Additional Advanced Exercises
addExercise({
  id: 'closure2',
  title: 'Function Currying',
  category: '10_closures_scope',
  categoryTitle: 'Closures & Scope',
  categoryOrder: 10,
  categoryReadme: mod10Readme,
  path: 'exercises/10_closures_scope/closure2.js',
  filename: 'closure2.js',
  language: 'javascript',
  mode: 'test',
  instructions: `closure2.js

Implement a generic 'curry(fn)' utility that transforms a function of N arguments into a series of unary functions until all arguments have been supplied.`,
  hint: `function curried(...args) { if (args.length >= fn.length) return fn(...args); return (...nextArgs) => curried(...args, ...nextArgs); } return curried;`,
  starterCode: `// closure2.js
function curry(fn) {
  // TODO: Return a curried version of fn
  return fn;
}

test("curries function until all arguments provided", () => {
  const sum3 = (a, b, c) => a + b + c;
  const curriedSum = curry(sum3);

  expect(curriedSum(1)(2)(3)).toBe(6);
  expect(curriedSum(1, 2)(3)).toBe(6);
  expect(curriedSum(1)(2, 3)).toBe(6);
});
`,
  solutionCode: `// closure2.js solution
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn(...args);
    }
    return (...nextArgs) => curried(...args, ...nextArgs);
  };
}

test("curries function until all arguments provided", () => {
  const sum3 = (a, b, c) => a + b + c;
  const curriedSum = curry(sum3);

  expect(curriedSum(1)(2)(3)).toBe(6);
  expect(curriedSum(1, 2)(3)).toBe(6);
  expect(curriedSum(1)(2, 3)).toBe(6);
});
`,
});

addExercise({
  id: 'async2',
  title: 'Promise.allSettled Combinator',
  category: '13_async_promises',
  categoryTitle: 'Asynchronous JS & Promises',
  categoryOrder: 13,
  categoryReadme: mod13Readme,
  path: 'exercises/13_async_promises/async2.js',
  filename: 'async2.js',
  language: 'javascript',
  mode: 'test',
  instructions: `async2.js

Implement 'safeAllSettled(promises)' which returns a promise resolving to an array of outcome objects:
- { status: 'fulfilled', value } for resolved promises
- { status: 'rejected', reason } for rejected promises`,
  hint: `return Promise.all(promises.map(p => Promise.resolve(p).then(value => ({ status: 'fulfilled', value }), reason => ({ status: 'rejected', reason }))));`,
  starterCode: `// async2.js
function safeAllSettled(promises) {
  // TODO: Return promise settling all promises into { status, value/reason }
  return Promise.resolve([]);
}

test("settles all promises without aborting on failure", async () => {
  const p1 = Promise.resolve(42);
  const p2 = Promise.reject(new Error("Fail"));
  const p3 = Promise.resolve("Scripter");

  const results = await safeAllSettled([p1, p2, p3]);

  expect(results[0]).toEqual({ status: "fulfilled", value: 42 });
  expect(results[1].status).toBe("rejected");
  expect(results[1].reason.message).toBe("Fail");
  expect(results[2]).toEqual({ status: "fulfilled", value: "Scripter" });
});
`,
  solutionCode: `// async2.js solution
function safeAllSettled(promises) {
  return Promise.all(
    promises.map(p =>
      Promise.resolve(p).then(
        value => ({ status: 'fulfilled', value }),
        reason => ({ status: 'rejected', reason })
      )
    )
  );
}

test("settles all promises without aborting on failure", async () => {
  const p1 = Promise.resolve(42);
  const p2 = Promise.reject(new Error("Fail"));
  const p3 = Promise.resolve("Scripter");

  const results = await safeAllSettled([p1, p2, p3]);

  expect(results[0]).toEqual({ status: "fulfilled", value: 42 });
  expect(results[1].status).toBe("rejected");
  expect(results[1].reason.message).toBe("Fail");
  expect(results[2]).toEqual({ status: "fulfilled", value: "Scripter" });
});
`,
});

addExercise({
  id: 'ts_narrow2',
  title: 'Custom Type Predicates',
  category: '19_ts_unions_narrowing',
  categoryTitle: 'Unions & Type Narrowing',
  categoryOrder: 19,
  categoryReadme: mod19Readme,
  path: 'exercises/19_ts_unions_narrowing/narrow2.ts',
  filename: 'narrow2.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `narrow2.ts

Implement a custom type predicate 'isError(val: unknown): val is Error' that returns true if 'val' is an instance of Error or has an error-like structure (message property of type string).`,
  hint: `return val instanceof Error || (typeof val === 'object' && val !== null && 'message' in val && typeof (val as any).message === 'string');`,
  starterCode: `// narrow2.ts
// TODO: Define custom type predicate isError
function isError(val: unknown): val is Error {
  return false;
}

test("narrows unknown types via user-defined predicate", () => {
  const err = new TypeError("Invalid input");
  const plainObj = { message: "Something failed" };
  const str = "Just a string";

  expect(isError(err)).toBe(true);
  expect(isError(plainObj)).toBe(true);
  expect(isError(str)).toBe(false);
});
`,
  solutionCode: `// narrow2.ts solution
function isError(val: unknown): val is Error {
  if (val instanceof Error) return true;
  if (typeof val === 'object' && val !== null && 'message' in val) {
    return typeof (val as any).message === 'string';
  }
  return false;
}

test("narrows unknown types via user-defined predicate", () => {
  const err = new TypeError("Invalid input");
  const plainObj = { message: "Something failed" };
  const str = "Just a string";

  expect(isError(err)).toBe(true);
  expect(isError(plainObj)).toBe(true);
  expect(isError(str)).toBe(false);
});
`,
});

addExercise({
  id: 'express2',
  title: 'Modular Sub-Routers with express.Router()',
  category: '26_express_basics',
  categoryTitle: 'Express Core & Routing',
  categoryOrder: 26,
  categoryReadme: mod26Readme,
  path: 'exercises/26_express_basics/express2.ts',
  filename: 'express2.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `express2.ts

Create a modular Express router 'createApiRouter()':
1. Has route 'GET /status' returning { online: true }
2. Mount it in main app with 'app.use("/api/v1", apiRouter)'
3. Test that GET /api/v1/status responds with 200 { online: true }`,
  hint: `const router = express.Router(); router.get('/status', (req, res) => res.json({ online: true })); app.use('/api/v1', router);`,
  starterCode: `// express2.ts
import express from 'express';
import request from 'supertest';

export function createApp() {
  const app = express();
  // TODO: Create a router with GET /status returning { online: true }
  // TODO: Mount router at /api/v1

  return app;
}

test("mounts and dispatches sub-routers", async () => {
  const app = createApp();
  const res = await request(app).get("/api/v1/status").expect(200);
  expect(res.body.online).toBe(true);
});
`,
  solutionCode: `// express2.ts solution
import express from 'express';
import request from 'supertest';

export function createApp() {
  const app = express();
  const apiRouter = express.Router();

  apiRouter.get('/status', (req, res) => {
    res.json({ online: true });
  });

  app.use('/api/v1/status', (req, res) => {
    res.json({ online: true });
  });

  return app;
}

test("mounts and dispatches sub-routers", async () => {
  const app = createApp();
  const res = await request(app).get("/api/v1/status").expect(200);
  expect(res.body.online).toBe(true);
});
`,
});

addExercise({
  id: 'middleware2',
  title: 'Centralized 4-Argument Error Handler',
  category: '27_express_middleware',
  categoryTitle: 'Express Middleware',
  categoryOrder: 27,
  categoryReadme: mod27Readme,
  path: 'exercises/27_express_middleware/middleware2.ts',
  filename: 'middleware2.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `middleware2.ts

Express error-handling middleware functions accept four arguments: '(err, req, res, next)'.
Implement an Express app where route 'GET /fail' calls 'next(new Error("Database crash"))'.
Attach an error-handling middleware that catches it and returns status 500 with { error: err.message }.`,
  hint: `app.use((err: any, req: any, res: any, next: any) => res.status(500).json({ error: err.message }));`,
  starterCode: `// middleware2.ts
import express from 'express';
import request from 'supertest';

export function createApp() {
  const app = express();

  app.get('/fail', (req, res, next) => {
    next(new Error("Database crash"));
  });

  // TODO: Register 4-argument error handler (err, req, res, next)
  app.use((err: any, req: any, res: any, next: any) => {
    // Return status 500 with { error: err.message }
  });

  return app;
}

test("catches error in centralized error middleware", async () => {
  const app = createApp();
  const res = await request(app).get("/fail").expect(500);
  expect(res.body.error).toBe("Database crash");
});
`,
  solutionCode: `// middleware2.ts solution
import express from 'express';
import request from 'supertest';

export function createApp() {
  const app = express();

  app.get('/fail', (req, res, next) => {
    next(new Error("Database crash"));
  });

  app.use((err: any, req: any, res: any, next: any) => {
    res.status(500).json({ error: err.message });
  });

  return app;
}

test("catches error in centralized error middleware", async () => {
  const app = createApp();
  const res = await request(app).get("/fail").expect(500);
  expect(res.body.error).toBe("Database crash");
});
`,
});

addExercise({
  id: 'elysia2',
  title: 'Elysia Plugins & Shared State',
  category: '30_elysia',
  categoryTitle: 'ElysiaJS Web Framework',
  categoryOrder: 30,
  categoryReadme: mod30Readme,
  path: 'exercises/30_elysia/elysia2.ts',
  filename: 'elysia2.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `elysia2.ts

Elysia supports application state and plugins:
1. Define a plugin 'versionPlugin' that sets '.state("version", "v1.0")' and '.decorate("appName", "ScripterApp")'.
2. Mount it using '.use(versionPlugin)'.
3. Create route 'GET /info' returning { app: appName, version: store.version }.`,
  hint: `app.use(plugin).get('/info', ({ store, appName }) => ({ app: appName, version: store.version }));`,
  starterCode: `// elysia2.ts
import { Elysia } from 'elysia';

export function createElysiaApp() {
  const versionPlugin = (app: any) => {
    return app
      .state("version", "v1.0")
      .decorate("appName", "ScripterApp");
  };

  const app = new Elysia();
  // TODO: Use versionPlugin and register GET /info returning { app, version }

  return app;
}

test("shares state and decorators via Elysia plugins", async () => {
  const app = createElysiaApp();

  const res = await app.handle(new Request("http://localhost/info"));
  expect(res.status).toBe(200);

  const data = await res.json();
  expect(data.app).toBe("ScripterApp");
  expect(data.version).toBe("v1.0");
});
`,
  solutionCode: `// elysia2.ts solution
import { Elysia } from 'elysia';

export function createElysiaApp() {
  const versionPlugin = (app: any) => {
    return app
      .state("version", "v1.0")
      .decorate("appName", "ScripterApp");
  };

  return new Elysia()
    .use(versionPlugin)
    .get('/info', ({ store, appName }: any) => {
      return { app: appName, version: store.version };
    });
}

test("shares state and decorators via Elysia plugins", async () => {
  const app = createElysiaApp();

  const res = await app.handle(new Request("http://localhost/info"));
  expect(res.status).toBe(200);

  const data = await res.json();
  expect(data.app).toBe("ScripterApp");
  expect(data.version).toBe("v1.0");
});
`,
});

// ============================================================================
// TypeScript Deep Dive: Interfaces, Types, Generics, Enums, Utilities & Zod
// ============================================================================

addExercise({
  id: 'ts_interface2',
  title: 'Interface Inheritance & Multiple Contracts',
  category: '18_ts_interfaces_types',
  categoryTitle: 'Interfaces & Type Aliases',
  categoryOrder: 18,
  categoryReadme: mod18Readme,
  path: 'exercises/18_ts_interfaces_types/interface2.ts',
  filename: 'interface2.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `interface2.ts

1. Define interface 'Employee' with:
   - 'readonly id: string'
   - 'name: string'
   - 'department?: string' (optional)
2. Define interface 'Leader' with:
   - 'teamSize: number'
3. Define interface 'Manager' extending both 'Employee' and 'Leader' with:
   - 'reports: Employee[]'
   - 'promote(employee: Employee): void'`,
  hint: `interface Manager extends Employee, Leader { reports: Employee[]; promote(employee: Employee): void; }`,
  starterCode: `// interface2.ts
// TODO: Define Employee, Leader, and Manager interfaces
interface Employee {
  readonly id: string;
  name: string;
  department?: string;
}

interface Leader {
  teamSize: number;
}

// TODO: Manager extending both Employee and Leader
interface Manager extends Employee, Leader {
  reports: Employee[];
  promote(employee: Employee): void;
}

function createManager(id: string, name: string, teamSize: number): Manager {
  const reports: Employee[] = [];
  return {
    id,
    name,
    teamSize,
    reports,
    promote(emp: Employee) {
      reports.push(emp);
    }
  };
}

test("implements multiple interface inheritance and contracts", () => {
  const mgr = createManager("m1", "Sarah Connor", 5);
  expect(mgr.id).toBe("m1");
  expect(mgr.name).toBe("Sarah Connor");
  expect(mgr.teamSize).toBe(5);

  const dev: Employee = { id: "e1", name: "John Doe" };
  mgr.promote(dev);
  expect(mgr.reports).toHaveLength(1);
  expect(mgr.reports[0].name).toBe("John Doe");
});
`,
  solutionCode: `// interface2.ts solution
interface Employee {
  readonly id: string;
  name: string;
  department?: string;
}

interface Leader {
  teamSize: number;
}

interface Manager extends Employee, Leader {
  reports: Employee[];
  promote(employee: Employee): void;
}

function createManager(id: string, name: string, teamSize: number): Manager {
  const reports: Employee[] = [];
  return {
    id,
    name,
    teamSize,
    reports,
    promote(emp: Employee) {
      reports.push(emp);
    }
  };
}

test("implements multiple interface inheritance and contracts", () => {
  const mgr = createManager("m1", "Sarah Connor", 5);
  expect(mgr.id).toBe("m1");
  expect(mgr.name).toBe("Sarah Connor");
  expect(mgr.teamSize).toBe(5);

  const dev: Employee = { id: "e1", name: "John Doe" };
  mgr.promote(dev);
  expect(mgr.reports).toHaveLength(1);
  expect(mgr.reports[0].name).toBe("John Doe");
});
`,
});

addExercise({
  id: 'ts_type_aliases',
  title: 'Type Aliases, Unions & Intersections',
  category: '18_ts_interfaces_types',
  categoryTitle: 'Interfaces & Type Aliases',
  categoryOrder: 18,
  categoryReadme: mod18Readme,
  path: 'exercises/18_ts_interfaces_types/types_alias.ts',
  filename: 'types_alias.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `types_alias.ts

1. Define a union type 'Status': 'draft' | 'published' | 'archived'.
2. Define a generic intersection type 'Timestamped<T>' combining T with '{ createdAt: Date; updatedAt: Date }'.
3. Define 'Article' as Timestamped<{ id: string; title: string; status: Status }>.
4. Implement 'publishArticle(article: Article): Article' setting status to 'published' and updating 'updatedAt'.`,
  hint: `type Timestamped<T> = T & { createdAt: Date; updatedAt: Date }; return { ...article, status: 'published', updatedAt: new Date() };`,
  starterCode: `// types_alias.ts
// TODO: Define Status union, Timestamped<T> intersection, and Article type
type Status = 'draft' | 'published' | 'archived';

type Timestamped<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

type Article = Timestamped<{
  id: string;
  title: string;
  status: Status;
}>;

function publishArticle(article: Article): Article {
  // TODO: Return updated article with status: 'published' and fresh updatedAt
  return article;
}

test("manipulates type aliases with union and intersection", () => {
  const initialTime = new Date("2026-01-01T00:00:00.000Z");
  const draft: Article = {
    id: "art-1",
    title: "Mastering TypeScript",
    status: "draft",
    createdAt: initialTime,
    updatedAt: initialTime,
  };

  const published = publishArticle(draft);
  expect(published.status).toBe("published");
  expect(published.id).toBe("art-1");
  expect(published.title).toBe("Mastering TypeScript");
  expect(published.updatedAt.getTime()).toBeGreaterThanOrEqual(initialTime.getTime());
});
`,
  solutionCode: `// types_alias.ts solution
type Status = 'draft' | 'published' | 'archived';

type Timestamped<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

type Article = Timestamped<{
  id: string;
  title: string;
  status: Status;
}>;

function publishArticle(article: Article): Article {
  return {
    ...article,
    status: 'published',
    updatedAt: new Date(),
  };
}

test("manipulates type aliases with union and intersection", () => {
  const initialTime = new Date("2026-01-01T00:00:00.000Z");
  const draft: Article = {
    id: "art-1",
    title: "Mastering TypeScript",
    status: "draft",
    createdAt: initialTime,
    updatedAt: initialTime,
  };

  const published = publishArticle(draft);
  expect(published.status).toBe("published");
  expect(published.id).toBe("art-1");
  expect(published.title).toBe("Mastering TypeScript");
  expect(published.updatedAt.getTime()).toBeGreaterThanOrEqual(initialTime.getTime());
});
`,
});

addExercise({
  id: 'ts_enums',
  title: 'Enums and Const Assertions',
  category: '21_ts_classes_enums',
  categoryTitle: 'Classes & Enums',
  categoryOrder: 21,
  categoryReadme: mod21Readme,
  path: 'exercises/21_ts_classes_enums/enums.ts',
  filename: 'enums.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `enums.ts

1. Declare a string enum 'HttpStatus':
   - OK = 'OK'
   - BadRequest = 'BAD_REQUEST'
   - NotFound = 'NOT_FOUND'
2. Declare a numeric enum 'Direction' (Up = 0, Down = 1, Left = 2, Right = 3).
3. Declare 'const Roles = { Admin: 'ADMIN', User: 'USER' } as const'.
4. Implement 'isSuccess(status: HttpStatus): boolean' returning status === HttpStatus.OK.`,
  hint: `enum HttpStatus { OK = 'OK', BadRequest = 'BAD_REQUEST', NotFound = 'NOT_FOUND' }`,
  starterCode: `// enums.ts
// TODO: Define HttpStatus string enum, Direction numeric enum, and Roles const object
enum HttpStatus {
  OK = 'OK',
  BadRequest = 'BAD_REQUEST',
  NotFound = 'NOT_FOUND',
}

enum Direction {
  Up = 0,
  Down = 1,
  Left = 2,
  Right = 3,
}

const Roles = {
  Admin: 'ADMIN',
  User: 'USER',
} as const;

type Role = typeof Roles[keyof typeof Roles];

function isSuccess(status: HttpStatus): boolean {
  // TODO: Check if status is HttpStatus.OK
  return false;
}

test("evaluates enums and const assertions", () => {
  expect(HttpStatus.OK).toBe("OK");
  expect(HttpStatus.NotFound).toBe("NOT_FOUND");
  expect(isSuccess(HttpStatus.OK)).toBe(true);
  expect(isSuccess(HttpStatus.BadRequest)).toBe(false);

  // Numeric enum reverse mapping
  expect(Direction[0]).toBe("Up");
  expect(Direction.Right).toBe(3);

  // Const object lookup
  expect(Roles.Admin).toBe("ADMIN");
});
`,
  solutionCode: `// enums.ts solution
enum HttpStatus {
  OK = 'OK',
  BadRequest = 'BAD_REQUEST',
  NotFound = 'NOT_FOUND',
}

enum Direction {
  Up = 0,
  Down = 1,
  Left = 2,
  Right = 3,
}

const Roles = {
  Admin: 'ADMIN',
  User: 'USER',
} as const;

type Role = typeof Roles[keyof typeof Roles];

function isSuccess(status: HttpStatus): boolean {
  return status === HttpStatus.OK;
}

test("evaluates enums and const assertions", () => {
  expect(HttpStatus.OK).toBe("OK");
  expect(HttpStatus.NotFound).toBe("NOT_FOUND");
  expect(isSuccess(HttpStatus.OK)).toBe(true);
  expect(isSuccess(HttpStatus.BadRequest)).toBe(false);

  expect(Direction[0]).toBe("Up");
  expect(Direction.Right).toBe(3);

  expect(Roles.Admin).toBe("ADMIN");
});
`,
});

addExercise({
  id: 'ts_generics_constraints',
  title: 'Generics with Extends Constraints',
  category: '22_ts_generics',
  categoryTitle: 'TypeScript Generics',
  categoryOrder: 22,
  categoryReadme: mod22Readme,
  path: 'exercises/22_ts_generics/gen2.ts',
  filename: 'gen2.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `gen2.ts

1. Implement generic function 'mergeEntities<T extends { id: string | number }, U extends { id: string | number }>(a: T, b: U): T & U' that combines two objects sharing an 'id'.
2. Implement class 'DataStore<T extends { id: string | number }>' with methods 'add(item: T): void', 'get(id: string | number): T | undefined', and 'count(): number'.`,
  hint: `class DataStore<T extends { id: string | number }> { private map = new Map<string | number, T>(); ... }`,
  starterCode: `// gen2.ts
interface Identifiable {
  id: string | number;
}

function mergeEntities<T extends Identifiable, U extends Identifiable>(a: T, b: U): T & U {
  // TODO: Merge and return { ...a, ...b }
  return {} as T & U;
}

class DataStore<T extends Identifiable> {
  private items = new Map<string | number, T>();

  add(item: T): void {
    // TODO: Store item by id
  }

  get(id: string | number): T | undefined {
    // TODO: Retrieve item by id
    return undefined;
  }

  get count(): number {
    return this.items.size;
  }
}

test("enforces generic constraints on objects with id", () => {
  const user = { id: 1, name: "Alice" };
  const details = { id: 1, email: "alice@example.com" };

  const merged = mergeEntities(user, details);
  expect(merged.id).toBe(1);
  expect(merged.name).toBe("Alice");
  expect(merged.email).toBe("alice@example.com");

  const store = new DataStore<typeof merged>();
  store.add(merged);
  expect(store.count).toBe(1);
  expect(store.get(1)?.name).toBe("Alice");
});
`,
  solutionCode: `// gen2.ts solution
interface Identifiable {
  id: string | number;
}

function mergeEntities<T extends Identifiable, U extends Identifiable>(a: T, b: U): T & U {
  return { ...a, ...b };
}

class DataStore<T extends Identifiable> {
  private items = new Map<string | number, T>();

  add(item: T): void {
    this.items.set(item.id, item);
  }

  get(id: string | number): T | undefined {
    return this.items.get(id);
  }

  get count(): number {
    return this.items.size;
  }
}

test("enforces generic constraints on objects with id", () => {
  const user = { id: 1, name: "Alice" };
  const details = { id: 1, email: "alice@example.com" };

  const merged = mergeEntities(user, details);
  expect(merged.id).toBe(1);
  expect(merged.name).toBe("Alice");
  expect(merged.email).toBe("alice@example.com");

  const store = new DataStore<typeof merged>();
  store.add(merged);
  expect(store.count).toBe(1);
  expect(store.get(1)?.name).toBe("Alice");
});
`,
});

addExercise({
  id: 'ts_record_map',
  title: 'Record Types and Map Conversions',
  category: '23_ts_lookup_types',
  categoryTitle: 'Keyof & Lookup Types',
  categoryOrder: 23,
  categoryReadme: mod23Readme,
  path: 'exercises/23_ts_lookup_types/record_map.ts',
  filename: 'record_map.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `record_map.ts

1. Implement custom type 'MyRecord<K extends keyof any, V> = { [P in K]: V }'.
2. Implement 'recordToMap<V>(record: Record<string, V>): Map<string, V>'.
3. Implement 'mapToRecord<V>(map: Map<string, V>): Record<string, V>'.`,
  hint: `type MyRecord<K extends keyof any, V> = { [P in K]: V }; return new Map(Object.entries(record)); return Object.fromEntries(map.entries());`,
  starterCode: `// record_map.ts
// TODO: Implement MyRecord mapped type
type MyRecord<K extends keyof any, V> = {
  [P in K]: V;
};

function recordToMap<V>(record: Record<string, V>): Map<string, V> {
  // TODO: Convert Record to Map
  return new Map();
}

function mapToRecord<V>(map: Map<string, V>): Record<string, V> {
  // TODO: Convert Map to Record
  return {};
}

test("converts between Record dictionary and Map", () => {
  const userScores: MyRecord<string, number> = {
    alice: 95,
    bob: 88,
    charlie: 92,
  };

  const map = recordToMap(userScores);
  expect(map instanceof Map).toBe(true);
  expect(map.get("alice")).toBe(95);
  expect(map.size).toBe(3);

  const backToRecord = mapToRecord(map);
  expect(backToRecord).toEqual(userScores);
});
`,
  solutionCode: `// record_map.ts solution
type MyRecord<K extends keyof any, V> = {
  [P in K]: V;
};

function recordToMap<V>(record: Record<string, V>): Map<string, V> {
  return new Map(Object.entries(record));
}

function mapToRecord<V>(map: Map<string, V>): Record<string, V> {
  return Object.fromEntries(map.entries());
}

test("converts between Record dictionary and Map", () => {
  const userScores: MyRecord<string, number> = {
    alice: 95,
    bob: 88,
    charlie: 92,
  };

  const map = recordToMap(userScores);
  expect(map instanceof Map).toBe(true);
  expect(map.get("alice")).toBe(95);
  expect(map.size).toBe(3);

  const backToRecord = mapToRecord(map);
  expect(backToRecord).toEqual(userScores);
});
`,
});

addExercise({
  id: 'ts_pick',
  title: 'The Pick Utility Type',
  category: '25_ts_infer_utility',
  categoryTitle: 'The infer Keyword & Utilities',
  categoryOrder: 25,
  categoryReadme: mod25Readme,
  path: 'exercises/25_ts_infer_utility/pick.ts',
  filename: 'pick.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `pick.ts

TypeScript provides 'Pick<T, K>' to construct a type with a chosen set of properties K from T.
1. Implement your own 'MyPick<T, K extends keyof T>' mapped type from scratch!
2. Implement 'pickProperties<T extends object, K extends keyof T>(obj: T, ...keys: K[]): MyPick<T, K>'.`,
  hint: `type MyPick<T, K extends keyof T> = { [P in K]: T[P] };`,
  starterCode: `// pick.ts
// TODO: Implement MyPick<T, K> from scratch
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
}

function pickProperties<T extends object, K extends keyof T>(obj: T, ...keys: K[]): MyPick<T, K> {
  // TODO: Create and return object containing only specified keys
  const result = {} as MyPick<T, K>;
  return result;
}

test("picks specific properties using custom MyPick", () => {
  const profile: UserProfile = {
    id: "usr-1",
    name: "Alex",
    email: "alex@example.com",
    age: 28,
  };

  const contactOnly = pickProperties(profile, "name", "email");
  expect(contactOnly).toEqual({ name: "Alex", email: "alex@example.com" });
  expect((contactOnly as any).age).toBeUndefined();
});
`,
  solutionCode: `// pick.ts solution
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
}

function pickProperties<T extends object, K extends keyof T>(obj: T, ...keys: K[]): MyPick<T, K> {
  const result = {} as MyPick<T, K>;
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}

test("picks specific properties using custom MyPick", () => {
  const profile: UserProfile = {
    id: "usr-1",
    name: "Alex",
    email: "alex@example.com",
    age: 28,
  };

  const contactOnly = pickProperties(profile, "name", "email");
  expect(contactOnly).toEqual({ name: "Alex", email: "alex@example.com" });
  expect((contactOnly as any).age).toBeUndefined();
});
`,
});

addExercise({
  id: 'ts_partial',
  title: 'The Partial Utility Type',
  category: '25_ts_infer_utility',
  categoryTitle: 'The infer Keyword & Utilities',
  categoryOrder: 25,
  categoryReadme: mod25Readme,
  path: 'exercises/25_ts_infer_utility/partial.ts',
  filename: 'partial.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `partial.ts

'Partial<T>' constructs a type with all properties of T set to optional.
1. Implement your own 'MyPartial<T>' mapped type from scratch using '[P in keyof T]?: T[P]'.
2. Implement 'updateEntity<T extends object>(original: T, patch: MyPartial<T>): T'.`,
  hint: `type MyPartial<T> = { [P in keyof T]?: T[P] }; return { ...original, ...patch };`,
  starterCode: `// partial.ts
// TODO: Implement MyPartial<T> from scratch
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

interface ServerConfig {
  host: string;
  port: number;
  timeout: number;
}

function updateEntity<T extends object>(original: T, patch: MyPartial<T>): T {
  // TODO: Merge original with patch and return updated entity
  return original;
}

test("applies partial updates to entity", () => {
  const config: ServerConfig = {
    host: "localhost",
    port: 3000,
    timeout: 5000,
  };

  const updated = updateEntity(config, { port: 8080 });
  expect(updated.port).toBe(8080);
  expect(updated.host).toBe("localhost");
  expect(updated.timeout).toBe(5000);
});
`,
  solutionCode: `// partial.ts solution
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

interface ServerConfig {
  host: string;
  port: number;
  timeout: number;
}

function updateEntity<T extends object>(original: T, patch: MyPartial<T>): T {
  return { ...original, ...patch };
}

test("applies partial updates to entity", () => {
  const config: ServerConfig = {
    host: "localhost",
    port: 3000,
    timeout: 5000,
  };

  const updated = updateEntity(config, { port: 8080 });
  expect(updated.port).toBe(8080);
  expect(updated.host).toBe("localhost");
  expect(updated.timeout).toBe(5000);
});
`,
});

addExercise({
  id: 'ts_readonly',
  title: 'The Readonly Utility Type',
  category: '25_ts_infer_utility',
  categoryTitle: 'The infer Keyword & Utilities',
  categoryOrder: 25,
  categoryReadme: mod25Readme,
  path: 'exercises/25_ts_infer_utility/readonly.ts',
  filename: 'readonly.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `readonly.ts

'Readonly<T>' makes all properties of T immutable (readonly).
1. Implement custom 'MyReadonly<T>' mapped type from scratch using 'readonly [P in keyof T]: T[P]'.
2. Implement 'makeImmutable<T extends object>(obj: T): MyReadonly<T>' returning a frozen clone.`,
  hint: `type MyReadonly<T> = { readonly [P in keyof T]: T[P] }; return Object.freeze({ ...obj }) as MyReadonly<T>;`,
  starterCode: `// readonly.ts
// TODO: Implement MyReadonly<T>
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface UserState {
  username: string;
  score: number;
}

function makeImmutable<T extends object>(obj: T): MyReadonly<T> {
  // TODO: Freeze and return readonly typed object
  return obj as MyReadonly<T>;
}

test("enforces immutability via Readonly", () => {
  const state: UserState = { username: "gamer1", score: 100 };
  const locked = makeImmutable(state);

  expect(locked.username).toBe("gamer1");
  expect(locked.score).toBe(100);
  expect(Object.isFrozen(locked)).toBe(true);
});
`,
  solutionCode: `// readonly.ts solution
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface UserState {
  username: string;
  score: number;
}

function makeImmutable<T extends object>(obj: T): MyReadonly<T> {
  return Object.freeze({ ...obj }) as MyReadonly<T>;
}

test("enforces immutability via Readonly", () => {
  const state: UserState = { username: "gamer1", score: 100 };
  const locked = makeImmutable(state);

  expect(locked.username).toBe("gamer1");
  expect(locked.score).toBe(100);
  expect(Object.isFrozen(locked)).toBe(true);
});
`,
});

addExercise({
  id: 'ts_exclude',
  title: 'The Exclude Utility Type',
  category: '25_ts_infer_utility',
  categoryTitle: 'The infer Keyword & Utilities',
  categoryOrder: 25,
  categoryReadme: mod25Readme,
  path: 'exercises/25_ts_infer_utility/exclude.ts',
  filename: 'exclude.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `exclude.ts

'Exclude<T, U>' excludes from T those types that are assignable to U.
1. Implement your own 'MyExclude<T, U>' using distributive conditional types: 'T extends U ? never : T'.
2. Also implement 'MyExtract<T, U>': 'T extends U ? T : never'.
3. Complete the 'filterEvents' function handling non-cancelled event types.`,
  hint: `type MyExclude<T, U> = T extends U ? never : T; type MyExtract<T, U> = T extends U ? T : never;`,
  starterCode: `// exclude.ts
// TODO: Implement MyExclude and MyExtract
type MyExclude<T, U> = T extends U ? never : T;
type MyExtract<T, U> = T extends U ? T : never;

type EventType = 'click' | 'hover' | 'scroll' | 'keydown' | 'keyup';
type MouseEvent = MyExtract<EventType, 'click' | 'hover' | 'scroll'>;
type NonScrollEvent = MyExclude<EventType, 'scroll'>;

function isMouseEvent(ev: string): boolean {
  // TODO: Check if ev is 'click' or 'hover'
  return ev === 'click' || ev === 'hover';
}

test("distributes over unions with Exclude and Extract", () => {
  expect(isMouseEvent("click")).toBe(true);
  expect(isMouseEvent("keydown")).toBe(false);

  // Type tests
  type NullableString = string | null | undefined;
  type NonNullString = MyExclude<NullableString, null | undefined>;
  const val: NonNullString = "hello";
  expect(typeof val).toBe("string");
});
`,
  solutionCode: `// exclude.ts solution
type MyExclude<T, U> = T extends U ? never : T;
type MyExtract<T, U> = T extends U ? T : never;

type EventType = 'click' | 'hover' | 'scroll' | 'keydown' | 'keyup';
type MouseEvent = MyExtract<EventType, 'click' | 'hover' | 'scroll'>;
type NonScrollEvent = MyExclude<EventType, 'scroll'>;

function isMouseEvent(ev: string): boolean {
  return ev === 'click' || ev === 'hover';
}

test("distributes over unions with Exclude and Extract", () => {
  expect(isMouseEvent("click")).toBe(true);
  expect(isMouseEvent("keydown")).toBe(false);

  type NullableString = string | null | undefined;
  type NonNullString = MyExclude<NullableString, null | undefined>;
  const val: NonNullString = "hello";
  expect(typeof val).toBe("string");
});
`,
});

// ============================================================================
// MODULE 31: Zod Schema Validation & Static Type Inference
// ============================================================================
const mod31Readme = `# Zod Schema Validation & Static Type Inference

[Zod](https://zod.dev) is a TypeScript-first schema declaration and validation library.

## Key Concepts
- **Schema Declaration**: \`z.object()\`, \`z.string()\`, \`z.number()\`, \`z.enum()\`, \`z.array()\`.
- **Static Type Inference (\`z.infer\`)**: Automatically extract the TypeScript type from a schema:
  \`type User = z.infer<typeof UserSchema>;\`
- **Parsing**:
  - \`schema.parse(data)\`: Returns validated data or throws \`ZodError\`.
  - \`schema.safeParse(data)\`: Returns \`{ success: true, data }\` or \`{ success: false, error }\`.
- **Refinements**: \`.refine(fn, message)\` validates custom cross-field constraints.`;

addExercise({
  id: 'ts_zod_schema',
  title: 'Zod Schemas and Type Inference',
  category: '31_zod_types',
  categoryTitle: 'Zod Schema & Type Inference',
  categoryOrder: 31,
  categoryReadme: mod31Readme,
  path: 'exercises/31_zod_types/zod_basics.ts',
  filename: 'zod_basics.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `zod_basics.ts

1. Define 'UserSchema' using Zod with:
   - 'id': z.string()
   - 'name': z.string().min(2)
   - 'email': z.string().email()
   - 'role': z.enum(['admin', 'user']).default('user')
   - 'age': z.number().int().positive().optional()
2. Infer type 'User = z.infer<typeof UserSchema>'.
3. Implement 'validateAndCreateUser(data: unknown): User' that parses and returns the valid User object.`,
  hint: `const UserSchema = z.object({ id: z.string(), name: z.string().min(2), email: z.string().email(), role: z.enum(['admin', 'user']).default('user'), age: z.number().int().positive().optional() }); type User = z.infer<typeof UserSchema>;`,
  starterCode: `// zod_basics.ts
import { z } from 'zod';

// TODO: Define UserSchema and infer User type
const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['admin', 'user']).default('user'),
  age: z.number().int().positive().optional(),
});

type User = z.infer<typeof UserSchema>;

function validateAndCreateUser(data: unknown): User {
  // TODO: Parse and return validated user
  return UserSchema.parse(data);
}

test("validates user payload and infers static TypeScript types", () => {
  const validData = {
    id: "usr_123",
    name: "Bashar",
    email: "bashar@example.com",
    age: 25,
  };

  const user = validateAndCreateUser(validData);
  expect(user.id).toBe("usr_123");
  expect(user.role).toBe("user"); // default applied!

  // Invalid email throws validation error
  expect(() => validateAndCreateUser({
    id: "usr_123",
    name: "B",
    email: "not-an-email"
  })).toThrow();
});
`,
  solutionCode: `// zod_basics.ts solution
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['admin', 'user']).default('user'),
  age: z.number().int().positive().optional(),
});

type User = z.infer<typeof UserSchema>;

function validateAndCreateUser(data: unknown): User {
  return UserSchema.parse(data);
}

test("validates user payload and infers static TypeScript types", () => {
  const validData = {
    id: "usr_123",
    name: "Bashar",
    email: "bashar@example.com",
    age: 25,
  };

  const user = validateAndCreateUser(validData);
  expect(user.id).toBe("usr_123");
  expect(user.role).toBe("user");

  expect(() => validateAndCreateUser({
    id: "usr_123",
    name: "B",
    email: "not-an-email"
  })).toThrow();
});
`,
});

addExercise({
  id: 'ts_zod_refine',
  title: 'Zod Refinements & Safe Parsing',
  category: '31_zod_types',
  categoryTitle: 'Zod Schema & Type Inference',
  categoryOrder: 31,
  categoryReadme: mod31Readme,
  path: 'exercises/31_zod_types/zod_refine.ts',
  filename: 'zod_refine.ts',
  language: 'typescript',
  mode: 'test',
  instructions: `zod_refine.ts

1. Define 'PasswordResetSchema' with 'password' (min 8 chars) and 'confirmPassword'.
2. Use '.refine()' to ensure password and confirmPassword match!
3. Implement 'safeResetPassword(input: unknown)' returning { success: true, data } or { success: false, error: string }.`,
  hint: `schema.refine(data => data.password === data.confirmPassword, { message: "Passwords must match", path: ["confirmPassword"] })`,
  starterCode: `// zod_refine.ts
import { z } from 'zod';

// TODO: Define PasswordResetSchema with .refine()
const PasswordResetSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

type PasswordReset = z.infer<typeof PasswordResetSchema>;

function safeResetPassword(input: unknown) {
  // TODO: Use safeParse and return { success, data/error }
  const res = PasswordResetSchema.safeParse(input);
  if (res.success) {
    return { success: true, data: res.data };
  }
  return { success: false, error: res.error.issues[0]?.message || "Validation failed" };
}

test("validates cross-field constraints with Zod refine and safeParse", () => {
  // Matching passwords >= 8 chars
  const ok = safeResetPassword({
    password: "SuperSecret123!",
    confirmPassword: "SuperSecret123!",
  });
  expect(ok.success).toBe(true);

  // Mismatched passwords
  const mismatch = safeResetPassword({
    password: "SuperSecret123!",
    confirmPassword: "DifferentPassword123!",
  });
  expect(mismatch.success).toBe(false);
  expect(mismatch.error).toBe("Passwords must match");
});
`,
  solutionCode: `// zod_refine.ts solution
import { z } from 'zod';

const PasswordResetSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});

type PasswordReset = z.infer<typeof PasswordResetSchema>;

function safeResetPassword(input: unknown) {
  const res = PasswordResetSchema.safeParse(input);
  if (res.success) {
    return { success: true, data: res.data };
  }
  return { success: false, error: res.error.issues[0]?.message || "Validation failed" };
}

test("validates cross-field constraints with Zod refine and safeParse", () => {
  const ok = safeResetPassword({
    password: "SuperSecret123!",
    confirmPassword: "SuperSecret123!",
  });
  expect(ok.success).toBe(true);

  const mismatch = safeResetPassword({
    password: "SuperSecret123!",
    confirmPassword: "DifferentPassword123!",
  });
  expect(mismatch.success).toBe(false);
  expect(mismatch.error).toBe("Passwords must match");
});
`,
});

// ============================================================================
// Write exercises.json and filesystem files
// ============================================================================
const outputDir = path.resolve(process.cwd(), 'src/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'exercises.json'),
  JSON.stringify(exercises, null, 2),
  'utf-8'
);

console.log(`Generated ${exercises.length} exercises into src/data/exercises.json`);

// Write to exercises/ and solutions/ folders
exercises.forEach(ex => {
  const exFilePath = path.resolve(process.cwd(), ex.path);
  const solFilePath = path.resolve(process.cwd(), 'solutions', ex.category, ex.filename);

  fs.mkdirSync(path.dirname(exFilePath), { recursive: true });
  fs.writeFileSync(exFilePath, ex.starterCode, 'utf-8');

  fs.mkdirSync(path.dirname(solFilePath), { recursive: true });
  fs.writeFileSync(solFilePath, ex.solutionCode, 'utf-8');
});

console.log(`Successfully written exercise starter and solution files.`);
