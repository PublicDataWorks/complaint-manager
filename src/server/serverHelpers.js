import gracefulExit from "../sharedUtilities/gracefulExit";
import { server } from "./server";
import Boom from "boom";

export const handleSigterm = app => {
  if (app.locals.shuttingDown) return;
  app.locals.shuttingDown = true;
  gracefulExit(server);
};

export const refuseNewConnectionDuringShutdown =
  app => (request, response, next) => {
    if (!app.locals.shuttingDown) return next();
    response.set("Connection", "close");
    response.status(503).send("Server is in the process of restarting.");
  };
