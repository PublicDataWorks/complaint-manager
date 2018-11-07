import db from "../server/models";
const queue = require("../server/handlers/cases/export/jobQueue").createQueue();

const gracefulExit = server => {
  console.warn("Received kill signal (SIGTERM), shutting down");

  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 30000).unref();

  server.close(() => {
    db.sequelize.close().then(
      queue.shutdown(30000, () => {
        process.exit(0);
      })
    );
  });
};

export default gracefulExit;
