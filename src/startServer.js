import { server } from "./server/server";

server.listen(process.env.PORT || 1234, () => {
  console.info("Application is listening on port 1234");
  console.info("Please visit http://localhost:1234");
});
