export const sendMessage = (type, user, message) => {
  const jsonMessage = { type: type, message: message };
  user.response.write(`data: ${JSON.stringify(jsonMessage)}\n\n`);
};
