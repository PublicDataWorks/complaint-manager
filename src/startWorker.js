const server = require("./worker/worker");

server.listen(process.env.WORKER_PORT || 4567, () => {
  console.info("Application is listening on port 4567");
  console.info("Please visit http://localhost:4567");
});
