import { server } from "./worker/worker";
import kue from "kue";
const config = require("./server/config/config")[process.env.NODE_ENV];

kue.app.set("title", "Background Worker");

kue.app.listen(config.queue.jobUIPort);

server.listen(process.env.WORKER_PORT || 4567, () => {
  console.info("Application is listening on port 4567");
  console.info("Please visit http://localhost:4567");
});
