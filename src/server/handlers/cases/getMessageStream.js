import checkFeatureToggleEnabled from "../../checkFeatureToggleEnabled";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";

const asyncMiddleWare = require("../asyncMiddleware");

let clients = [];

export const getMessageStream = asyncMiddleWare(async (req, res, next) => {
  const realtimeNotificationsFeature = checkFeatureToggleEnabled(
    req,
    "realtimeNotificationsFeature"
  );

  if (!realtimeNotificationsFeature) {
    throw new Error(BAD_REQUEST_ERRORS.ACTION_NOT_ALLOWED);
  }

  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  // only set this header in local
  const env = process.env.NODE_ENV || "development";
  if (env === "development") {
    res.setHeader("Access-Control-Allow-Origin", "https://localhost");
  }

  res.flushHeaders();

  const clientEmail = req.nickname;
  const jsonMessage = {
    type: "connection",
    message: `${clientEmail} has subscribed to streaming messages including Notifications.`
  };
  res.write(`data: ${JSON.stringify(jsonMessage)} \n\n`);

  console.log("Initial Message sent from Message Stream");

  const newClient = {
    id: clientEmail,
    res
  };

  // replace any old connect with new connection if client is in clients array already
  let isNewClient = true;
  clients = clients.map(client => {
    if (client.id === newClient.id) {
      console.log("Client was replaced.");
      isNewClient = false;
      return newClient;
    } else {
      return client;
    }
  });
  if (isNewClient) {
    console.log("This is a new client");
    clients.push(newClient);
  }

  clients.map(client => console.log("ID", client.id));

  // When client closes connection we update the clients list
  // avoiding the disconnected one
  req.on("close", () => {
    console.log(`${clientEmail} Connection closed`);
    clients = clients.filter(c => c.id !== clientEmail);
  });

  const jsonPingMessage = { type: "ping", message: "PING!" };

  setInterval(() => {
    res.write(`data: ${JSON.stringify(jsonPingMessage)} \n\n`);
  }, 30 * 1000);
});

// Iterate clients list and use write res object method to send messages to all
export const sendNotification = message => {
  const jsonMessage = { type: "notifications", message: message };
  clients.forEach(c => c.res.write(`data: ${JSON.stringify(jsonMessage)}\n\n`));
};
