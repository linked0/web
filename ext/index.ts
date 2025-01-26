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
