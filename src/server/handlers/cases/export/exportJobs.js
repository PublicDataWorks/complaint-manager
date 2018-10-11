const asyncMiddleware = require("../../asyncMiddleware");
const kue = require("kue");
const kueJobQueue = require("./jobQueue");

const addJobsForUser = (ids, username, jobArray, callBack) => {
  ids.forEach(id => {
    kue.Job.get(id, (err, job) => {
      console.log("Found job", id);
      if (job.data.user === username) {
        console.log("Adding job", id);
        jobArray.push(job);
        console.log("job array size: ", jobArray.length);
      }
      if (callBack && ids[ids.length - 1] == id) {
        callBack();
      }
    });
  });
};

const exportJobs = asyncMiddleware(async (request, response, next) => {
  const activeAndCompletedJobs = [];

  kueJobQueue.active((err, ids) => {
    addJobsForUser(ids, request.nickname, activeAndCompletedJobs);
  });

  kueJobQueue.complete((err, ids) => {
    addJobsForUser(ids, request.nickname, activeAndCompletedJobs, () => {
      console.log("Returning ", activeAndCompletedJobs.length);
      response.send(activeAndCompletedJobs);
    });
  });
});

module.exports = exportJobs;
