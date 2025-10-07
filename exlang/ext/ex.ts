function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("World"));

class MyClass {
  private value: number;

  constructor() {
    this.value = 42;
  }

  public greet(): void {
    console.log("Hello from MyClass! Value:", this.value);
  }
}
const instance = new MyClass();
instance.greet(); // This line won't be reached

/*
 * 
 */
// 1️⃣ compiles even with the error flag.
let x: string =  "hi";
// TODO: comment out the next line to see the error
// x = 42;               // ❌ Type error, but JS still emitted

// 2️⃣ `as number` converts nothing—it's erased.
function asNumber(val: string | number): number {
  return val as number;   // runtime just returns val unchanged
}

console.log(asNumber("7") + 1);   // NaN at runtime

/*
 * 2. Structural typing can accept more than you bargained for
 */
interface Vector2D { x: number; y: number; }
interface Vector3D { x: number; y: number; z: number; }

function len2D(v: Vector2D) {
  return Math.sqrt(v.x ** 2 + v.y ** 2);
}

// TODO: comment out the next line to see the error
// const v3: Vector3D = { x: 3, y: 4, z: 12 };
// console.log(len2D(v3));   // ✅ compiles, but ignores `z`

interface Vector2D { kind: 'v2'; x: number; y: number }
interface Vector3D { kind: 'v3'; x: number; y: number; z: number }
function len(v: Vector2D | Vector3D) {
  return v.kind === 'v2'
    ? Math.hypot(v.x, v.y)
    : Math.hypot(v.x, v.y, v.z);
}
// TODO: comment out the next line to see the error
// console.log(len(v3));   // ✅ compiles, and works as expected

/*
 * 3. Classes are values and types — only one survives to JS
 */
class Rectangle { constructor(public w: number, public h: number) {} }
type Rect = Rectangle;          // ✅ `Rect` is just an alias for the *type*

function area(r: Rectangle) { return r.w * r.h }

declare const rectCtor: Rectangle; // ❌ Type used in value position; should be `typeof Rectangle`
declare const rectCtor2: typeof Rectangle; // ✅ `rectCtor2` is a value, but `typeof Rectangle` is a type

/*
 * 4. Compiler options change the language you think you’re using
 */
// try with  --strictNullChecks off vs on
function sayhi(name: string) {
  console.log(name.toUpperCase());
}
// TODO: comment out the next line to see the error
// sayhi(undefined);    // passes types without strictNullChecks

function doSomething(s: string) {
  console.log("Doing something with:", s);
}
/*
 * 5. Type guards are not type assertions
 */
function handle(raw: unknown) {
  if (typeof raw === 'string') {
    doSomething(raw);   // smart‑narrowed to `string`
  }
}

// Example of how to use the handle function
handle("Hello, TypeScript!");
handle(123); // This will do nothing, as raw is not a string.