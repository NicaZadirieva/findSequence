const { Worker } = require("worker_threads");

// TODO: сделать рефакторинг
function createWorkerProcess(array) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./parallel.js", {
      workerData: array,
    });

    worker.on("message", (res) => {
      resolve(res);
    });

    worker.on("close", (code) => {
      console.log(`Child process exited with code ${code}`);
    });
  });
}

module.exports = { createWorkerProcess };
