export const onMessage = (parsedData, notificationDispatch) => {
  if (parsedData.type === "notifications") {
    notificationDispatch(parsedData.message);
  }
};
