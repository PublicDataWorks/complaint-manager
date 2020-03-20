import db from "../server/complaintManager/models";
import getInstance from "../server/handlers/cases/export/queueFactory";

const queue = getInstance();

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
      queue.close().then(() => {
        process.exit(0);
      })
    );
  });
};

export default gracefulExit;
