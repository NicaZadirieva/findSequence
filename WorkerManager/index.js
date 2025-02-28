const { Worker } = require("worker_threads");

class WorkerManager {
  constructor(pool = 4, data = [[], [], [], []]) {
    this.pool = pool;
    this.workers = [];
    this.processedDataIndexes = [];
    this.__createWorkers(data);
  }

  __addWorker(worker) {
    this.workers.push(worker);
  }

  __createWorkers(data) {
    for (let i = 0; i < this.pool; i++) {
      const worker = new Worker("./parallel.js", {
        // data[i] данные для i-го потока
        workerData: data[i],
      });
      this.__addWorker({ worker, isBusy: false });
    }
  }

  getFirstNotBusyWorker() {
    return this.workers.find((worker) => !worker.isBusy);
  }

  launchTask() {
    const worker = this.getFirstNotBusyWorker();
    if (!worker) {
      console.log("No workers are available. Task is waiting...");
      return;
    }

    return new Promise((resolve) => {
      worker.isBusy = true;
      worker.worker.on("message", (res) => {
        worker.isBusy = false;
        resolve(res);
      });
    });
  }
}

module.exports = WorkerManager;
