import { server } from "./worker/worker";

// TODO Can we use any other UI for monitoring Bull Queue Jobs?
// kue.app.set("title", "Background Worker");
// kue.app.listen(config.queue.jobUIPort);

server.listen(process.env.WORKER_PORT || 4567, () => {
  console.info("Application is listening on port 4567");
  console.info("Please visit http://localhost:4567");
});
