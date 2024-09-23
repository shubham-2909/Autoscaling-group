import express from "express";
import cluster from "cluster";
import os from "os";
const totalCpus = os.cpus().length;
const port = 3000;

if (cluster.isPrimary) {
  console.log("Its a primary process");
  console.log(`Process id is ${process.pid}`);

  for (let i = 0; i < totalCpus; i++) {
    cluster.fork();
  }

  cluster.on("exit", function (worker, code, signal) {
    console.log(`Damn it worker ${worker.process.pid} died`);
    console.log("Gotta start another worker");

    cluster.fork();
  });
} else {
  const app = express();
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

  app.listen(3000, function () {
    console.log(`Sverver up on port ${port}`);
  });
}
