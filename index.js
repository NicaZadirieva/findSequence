const { createWorkerProcess } = require("./worker");
const getCenterElementInArray = require("./util");

const { performance, PerformanceObserver } = require("perf_hooks");
const os = require("os");

/**
 * Число ядер
 */
const COUNT_CORE = os.cpus().length;

const performanceObserver = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration} ms`);
  });
});
performanceObserver.observe({ entryTypes: ["measure"] });

function parallelExecution(arr) {
  const chunkSize = Math.ceil(arr.length / COUNT_CORE);
  const results = [];
  for (let i = 0; i < COUNT_CORE; i++) {
    const start = i * chunkSize;
    results.push(createWorkerProcess(arr.slice(start, start + 9 * chunkSize)));
  }
  performance.mark("parallel start");
  return Promise.all(results).then((res) => {
    performance.mark("parallel end");
    performance.measure("parallel", "parallel start", "parallel end");
  });
}

function linearExecution(arr) {
  performance.mark("linear start");
  getCenterElementInArray(arr);
  performance.mark("linear end");
  performance.measure("linear", "linear start", "linear end");
}
function main() {
  const array = [0, 0, 0, 1, 1, 1, 2, 2, 2, 1, 1, 1];
  linearExecution(array);
  parallelExecution(array);
}

main();
