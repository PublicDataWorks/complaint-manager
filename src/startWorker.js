const app = require("./worker/worker");

app.listen(process.env.WORKER_PORT || 4567, () => {
  console.log("Application is listening on port 4567");
  console.log("Please visit http://localhost:4567");
});
