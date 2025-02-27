const getCenterElementInArray = require("./util");
const { parentPort, workerData } = require("worker_threads");

parentPort.postMessage(getCenterElementInArray(workerData));
