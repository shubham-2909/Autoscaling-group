"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
const totalCpus = os_1.default.cpus().length;
const port = 3000;
if (cluster_1.default.isPrimary) {
    console.log("Its a primary process");
    console.log(`Process id is ${process.pid}`);
    for (let i = 0; i < totalCpus; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on("exit", function (worker, code, signal) {
        console.log(`Damn it worker ${worker.process.pid} died`);
        console.log("Gotta start another worker");
        cluster_1.default.fork();
    });
}
else {
    const app = (0, express_1.default)();
    console.log(`Worker ${process.pid} started`);
    app.get("/", function (req, res) {
        res.status(200).json({ message: "Hello world" });
    });
    app.get("/api/:n", function (req, res) {
        let n = Number(req.params.n);
        if (n > 50000000) {
            n = 50000000;
        }
        let sum = 0;
        for (let i = 0; i < n; i++) {
            sum += n;
        }
        console.log("Finished");
        res.status(200).json({ sum });
    });
}
