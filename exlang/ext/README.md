# Teypscrypt Project

## Run code
yarn tsx ex.ts 

## Old document
It’s just for reference.

## Set up environment for the first time
```
npm init -y
npm install --save-dev typescript
tsc --version
npx tsc --init
```

Set output folder in `tsconfig.json`
```
"outDir": "./dist", 
```

Create file `ex.ts`
```
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("World"));
```

Compile
```
npx tsc
```

Run
```
node dist/ex.js
```