const fs = require("fs");
const loader = require("@assemblyscript/loader");
const imports = {
  /* imports go here */
};
const wasmModule = loader.instantiateSync(
  fs.readFileSync(__dirname + "/build/optimized.wasm"),
  imports
);

// Glue code in order to use wasm squareArray
function squareArray(arr) {
  const {
    squareArray: wasmSquareArray,
    Int32Array_ID,
    __newArray,
    __getInt32Array,
  } = wasmModule.exports;
  const typedArray = __newArray(Int32Array_ID, arr); // takes a JS array and typeid, returns a wasm typed array
  const result = __getInt32Array(wasmSquareArray(typedArray)); // transforms wasm typed array back to JS array
  return result;
}

module.exports = {
  ...wasmModule.exports,
  squareArray,
};
