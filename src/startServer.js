import http from "http";
import gracefulExit from "./sharedUtilities/gracefulExit";
import app from "./server/server";

const server = http.createServer(app);
process.on("SIGTERM", handleSigterm);

function handleSigterm() {
  if (shuttingDown) return;
  shuttingDown = true;
  gracefulExit(server);
}

server.listen(process.env.PORT || 1234, () => {
  console.info("Application is listening on port 1234");
  console.info("Please visit http://localhost:1234");
});
