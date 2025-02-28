const WorkerManager = require("./WorkerManager");
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

async function parallelExecution(arr) {
  const chunkSize = Math.ceil(arr.length / COUNT_CORE);

  const data = [];
  for (let i = 0; i < COUNT_CORE; i++) {
    const start = i * chunkSize;
    data.push([arr.slice(start, start + 9 * chunkSize)]);
  }

  performance.mark("parallel start");
  const workerManager = new WorkerManager(chunkSize, data);
  let count_workers = 0;
  const res = [];
  while (count_workers < data.length) {
    const task = workerManager.launchTask();
    if (task) {
      count_workers++;
      res.push(
        await task.then((r) => {
          return r;
        })
      );
      console.log("res", res);
    }
  }
  performance.mark("parallel end");
  performance.measure("parallel", "parallel start", "parallel end");
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
