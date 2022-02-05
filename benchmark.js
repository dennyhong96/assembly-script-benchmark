const Benchmark = require("benchmark");

const wasm = require(".");

function runSruite(suite) {
  console.log("Running", suite.name);
  suite
    .on("cycle", (event) => {
      console.log(String(event.target));
    })
    .on("complete", function (event) {
      console.log(this.filter("fastest").map("name") + " won");
    })
    .run();
}

function addTest() {
  function addJs(a, b) {
    return a + b;
  }
  const addAs = wasm.add;
  const suite = Benchmark.Suite("add");
  suite
    .add("AssemblyScript", function () {
      addAs(10, 20);
    })
    .add("JavaScript", function () {
      addJs(10, 20);
    }); // JS wins - for simple operations, the cost of switching JS to AS is high
  runSruite(suite);
}
// addTest();

function factorialTest() {
  function factorialJs(i) {
    return i === 0 ? 1 : i * factorialJs(i - 1);
  }
  const factorialAs = wasm.factorial;
  const suite1 = Benchmark.Suite("factorial with small sample");
  suite1
    .add("AssemblyScript", function () {
      factorialAs(3);
    })
    .add("JavaScript", function () {
      factorialJs(3);
    }); // JS wins - for simple operations, the cost of switching JS to AS is high
  runSruite(suite1);

  const suite2 = Benchmark.Suite("factorial with large sample");
  suite2
    .add("AssemblyScript", function () {
      factorialAs(20);
    })
    .add("JavaScript", function () {
      factorialJs(20);
    }); // AS wins - for complex operations and large sample sizes, the benefit of AS is high

  runSruite(suite2);
}
// factorialTest();

function squareArrayTest() {
  function squareArrayJs(arr) {
    const len = arr.length;
    const result = new Int32Array(len);
    for (let i = 0; i < len; i++) {
      const int = arr[i];
      result[i] = int * int;
    }
    return result;
  }
  const squareArrayAs = wasm.squareArray;
  const suite1 = Benchmark.Suite("squareArray with small sample");
  suite1
    .add("AssemblyScript", function () {
      squareArrayAs(new Int32Array([1, 2, 3]));
    })
    .add("JavaScript", function () {
      squareArrayJs(new Int32Array([1, 2, 3]));
    });
  runSruite(suite1);
  const suite2 = Benchmark.Suite("squareArray with large sample");
  const largeArray = new Int32Array(9999).map(() =>
    Math.floor(Math.random() * 9999 + 1)
  );
  suite2
    .add("AssemblyScript", function () {
      squareArrayAs(largeArray);
    })
    .add("JavaScript", function () {
      squareArrayJs(largeArray);
    });
  runSruite(suite2);
  // JS sins both, passing large array from JS to wasm takes away a lot of the performance
}
// squareArrayTest();

function squareArrayTestV2() {
  function squareArrayV2Js(len) {
    const arr = new Int16Array(len).map((_, i) => i);
    const result = new Int32Array(len);
    for (let i = 0; i < len; i++) {
      const int = arr[i];
      result[i] = int * int;
    }
    return result;
  }
  const squareArrayV2As = wasm.squareArrayV2;
  const suite1 = Benchmark.Suite("squareArrayV2 with small sample");
  suite1
    .add("AssemblyScript", function () {
      squareArrayV2As(20);
    })
    .add("JavaScript", function () {
      squareArrayV2Js(20);
    });
  runSruite(suite1);
  const suite2 = Benchmark.Suite("squareArrayV2 with large sample");
  suite2
    .add("AssemblyScript", function () {
      squareArrayV2As(9999);
    })
    .add("JavaScript", function () {
      squareArrayV2Js(9999);
    });
  runSruite(suite2);
  // This time large array is generated in wasm intead of passed in from JS
  // so AS version won with the large sample size
}
squareArrayTestV2();

// The size of payload we pass from JS to wasm matters, the larger the payload
// the smaller the benefits of using wasm
// If we can get the payload we need already there in wasm, the benefit of using
// wasm is obviouos
