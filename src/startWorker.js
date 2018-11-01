import http from "http";
import gracefulExit from "./sharedUtilities/gracefulExit";
import app from "./worker/worker";

const server = http.createServer(app);
process.on("SIGTERM", handleSigterm);

function handleSigterm() {
  if (shuttingDown) return;
  shuttingDown = true;
  gracefulExit(server);
}

server.listen(process.env.WORKER_PORT || 4567, () => {
  console.info("Application is listening on port 4567");
  console.info("Please visit http://localhost:4567");
});
