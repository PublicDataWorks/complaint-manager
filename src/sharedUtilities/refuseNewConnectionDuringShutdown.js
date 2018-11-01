const refuseNewConnectionDuringShutdown = shuttingDown => (
  request,
  response,
  next
) => {
  if (!shuttingDown) return next();
  response.set("Connection", "close");
  response.status(503).send("Server is in the process of restarting.");
};

export default refuseNewConnectionDuringShutdown;
