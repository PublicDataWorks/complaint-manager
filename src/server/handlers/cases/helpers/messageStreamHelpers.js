export const sendMessage = (type, client, message) => {
  const jsonMessage = { type: type, message: message };
  client.response.write(`data: ${JSON.stringify(jsonMessage)}\n\n`);
};
