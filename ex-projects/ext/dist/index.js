"use strict";
function greet(name) {
    return `Hello, ${name}!`;
}
console.log(greet("World"));
class MyClass {
    constructor() {
        this.value = 42;
    }
    greet() {
        console.log("Hello from MyClass! Value:", this.value);
    }
}
const instance = new MyClass();
instance.greet(); // This line won't be reached
