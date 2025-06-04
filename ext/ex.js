function greet(name) {
    return "Hello, ".concat(name, "!");
}
console.log(greet("World"));
var MyClass = /** @class */ (function () {
    function MyClass() {
        this.value = 42;
    }
    MyClass.prototype.greet = function () {
        console.log("Hello from MyClass! Value:", this.value);
    };
    return MyClass;
}());
var instance = new MyClass();
instance.greet(); // This line won't be reached
/*
 *
 */
// 1️⃣ compiles even with the error flag.
var x = "hi";
x = 42; // ❌ Type error, but JS still emitted
// 2️⃣ `as number` converts nothing—it's erased.
function asNumber(val) {
    return val; // runtime just returns val unchanged
}
console.log(asNumber("7") + 1); // NaN at runtime
function len2D(v) {
    return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2));
}
var v3 = { x: 3, y: 4, z: 12 };
console.log(len2D(v3)); // ✅ compiles, but ignores `z`
function len(v) {
    return v.kind === 'v2'
        ? Math.hypot(v.x, v.y)
        : Math.hypot(v.x, v.y, v.z);
}
console.log(len(v3)); // ✅ compiles, and works as expected
/*
 * 3. Classes are values and types — only one survives to JS
 */
var Rectangle = /** @class */ (function () {
    function Rectangle(w, h) {
        this.w = w;
        this.h = h;
    }
    return Rectangle;
}());
function area(r) { return r.w * r.h; }
/*
 * 4. Compiler options change the language you think you’re using
 */
// try with  --strictNullChecks off vs on
function sayhi(name) {
    console.log(name.toUpperCase());
}
sayhi(undefined); // passes types without strictNullChecks
