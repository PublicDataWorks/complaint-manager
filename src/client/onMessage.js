export const onMessage = (parsedData, notificationDispatch) => {
  if (parsedData.type === "ping") {
    console.log("Ping from Server: ", parsedData.message);
  } else if (parsedData.type === "connection") {
    console.log("Connection: ", parsedData.message);
  } else if (parsedData.type === "notifications") {
    notificationDispatch(parsedData.message);
  }
};
