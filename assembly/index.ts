// The entry file of your WebAssembly module.

export function add(a: i32, b: i32): i32 {
  return a + b;
}

export function factorial(i: i32): i32 {
  return i === 0 ? 1 : i * factorial(i - 1);
}

// Because we are passing array between JS and webassembly, we need to export some type ids
export const Int32Array_ID = idof<Int32Array>(); // Gives us the id of Int32Array class type
export function squareArray(arr: Int32Array): Int32Array {
  const len = arr.length;
  const result = new Int32Array(len);
  for (let i = 0; i < len; i++) {
    const int = arr[i];
    result[i] = int * int;
  }
  return result;
}

export function squareArrayV2(len: i32): Int32Array {
  // arr is generated in wasm instead of passed in from JS
  const arr = new Int32Array(len).map((_, i) => i);
  const result = new Int32Array(len);
  for (let i = 0; i < len; i++) {
    const int = arr[i];
    result[i] = int * int;
  }
  return result;
}
