import winston from "winston";

export const sendMessage = (type, client, message) => {
  const jsonMessage = { type: type, message: message };
  try {
    const messageJson = JSON.stringify(jsonMessage);
    client.response.write(`data: ${messageJson}\n\n`);
  } catch (error) {
    winston.error(error);
    throw error;
  }
};
