import checkFeatureToggleEnabled from "../../checkFeatureToggleEnabled";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import { getNotifications } from "./getNotifications";
import moment from "moment";

const asyncMiddleWare = require("../asyncMiddleware");

let clients = [];

export const getMessageStream = asyncMiddleWare(
  async (request, response, next) => {
    const realtimeNotificationsFeature = checkFeatureToggleEnabled(
      request,
      "realtimeNotificationsFeature"
    );
    if (!realtimeNotificationsFeature) {
      throw new Error(BAD_REQUEST_ERRORS.ACTION_NOT_ALLOWED);
    }

    setResHeaders(response);

    const clientEmail = request.nickname;
    const jsonConnectionMessage = {
      type: "connection",
      message: `${clientEmail} has subscribed to streaming messages including Notifications.`
    };
    response.write(`data: ${JSON.stringify(jsonConnectionMessage)} \n\n`);

    const newClient = {
      id: clientEmail,
      response: response
    };

    await handleClients(newClient);

    request.on("close", () => {
      clients = clients.filter(c => c.id !== clientEmail);
    });

    const jsonPingMessage = { type: "ping", message: "PING!" };

    setInterval(() => {
      response.write(`data: ${JSON.stringify(jsonPingMessage)} \n\n`);
    }, 30 * 1000);
  }
);

const setResHeaders = response => {
  response.setHeader("Cache-Control", "no-cache");
  response.setHeader("Content-Type", "text/event-stream");
  response.setHeader("Connection", "keep-alive");

  const env = process.env.NODE_ENV || "development";
  if (env === "development") {
    response.setHeader("Access-Control-Allow-Origin", "https://localhost");
  }
};

const handleClients = async newClient => {
  let isNewClient = true;
  clients = clients.map(client => {
    if (client.id === newClient.id) {
      isNewClient = false;
      return newClient;
    } else {
      return client;
    }
  });
  if (isNewClient) {
    clients.push(newClient);
  }

  await sendNotification(newClient.id);
};

export const getClients = () => {
  return clients;
};

const isActiveClient = client => {
  let isActive = false;
  clients.map(c => {
    if (c.id === client) {
      isActive = true;
    }
  });
  return isActive;
};

export const sendNotification = async user => {
  if (isActiveClient(user)) {
    const timestamp = moment().subtract(30, "days");
    const message = await getNotifications(timestamp, user);

    clients.forEach(c => {
      if (c.id === user) {
        const jsonMessage = { type: "notifications", message: message };
        c.response.write(`data: ${JSON.stringify(jsonMessage)}\n\n`);
      }
    });
  }
};
