const assert = require("assert");

const myModule = require("..");

assert.strictEqual(myModule.add(1, 2), 3);
console.log("add ok");

assert.strictEqual(myModule.factorial(3), 6);
console.log("factorial ok");

assert.deepStrictEqual(
  myModule.squareArray([1, 2, 3, 4, 5]),
  new Int32Array([1, 4, 9, 16, 25])
);
console.log("squareArray ok");
