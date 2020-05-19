import checkFeatureToggleEnabled from "../../checkFeatureToggleEnabled";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import { sendMessage } from "./helpers/messageStreamHelpers";
import moment from "moment";
import { getNotifications } from "./getNotifications";

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
    const clientId = Date.now();
    const jsonConnectionMessage = {
      type: "connection",
      message: `${clientEmail} has subscribed to streaming messages including Notifications.`
    };
    response.write(`data: ${JSON.stringify(jsonConnectionMessage)} \n\n`);

    const newClient = {
      id: clientId,
      email: clientEmail,
      response: response
    };

    clients.push(newClient);

    await sendNotification(newClient.email);

    request.on("close", () => {
      clients = clients.filter(c => c.id !== clientId);
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
  if (env === "development_e2e") {
    response.setHeader("Access-Control-Allow-Origin", "https://app-e2e");
  }
};

export const getClients = () => {
  return clients;
};

export const getActiveClients = clientEmail => {
  let activeClients = [];
  clients.map(c => {
    if (c.email === clientEmail) {
      activeClients.push(c);
    }
  });
  return activeClients;
};

export const sendNotification = async userEmail => {
  let activeClients = getActiveClients(userEmail);
  for (const activeClient in activeClients) {
    const currentClient = activeClients[activeClient];
    const timestamp = moment().subtract(30, "days");
    const message = await getNotifications(timestamp, currentClient.email);

    sendMessage("notifications", currentClient, message);
  }
};
