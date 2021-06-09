const fs = require("fs");

// set a specific threshold (in ms) for an operation, otherwise DEFAULT will be used
// current thresholds were set to 10% above the runtime of a baseline test run
const THRESHOLDS = {
  // Case
  ["Create Case"]: 283,
  ["Delete Case"]: 53,
  ["Update Case to Restored"]: 73,
  ["Update Case Narrative"]: 283,
  ["Update Case Status"]: 323,
  // Case Tag
  ["Create Case Tag"]: 178,
  ["Retrieve Case Tags"]: 56,
  ["Delete Case Tag"]: 110,
  // Case Note
  ["Create Case Note"]: 338,
  ["Retrieve Case Notes"]: 297,
  ["Delete Case Note"]: 229,
  // Notification
  ["Retrieve Notifications"]: 155,
  ["Retrieve Notification Status"]: 36,
  ["Update Notification as Read"]: 141,
  // Case Officer
  ["Create Case Officer"]: 464,
  ["Create Case Officer Allegation"]: 298,
  ["Update Officer History"]: 92,
  // Referral Letter
  ["Retrieve Referral Letter"]: 140,
  ["Update Referral Letter Classifications"]: 79,
  ["Retrieve Referral Letter Preview"]: 645,
  ["Retrieve Referral Letter PDF"]: 1077,
  ["Update Referral Letter Content"]: 72,
  ["Retrieve Referral Letter Edit Status"]: 144,
  ["Update Referral Letter Address"]: 62,
  ["Update Referral Letter to Approved"]: 1851,
  ["Retrieve Final Referral Letter URL"]: 62,
  // Other
  ["Authorize API Backend"]: 395,
  ["Update Recommended Actions"]: 139,
  DEFAULT: 500
};

fs.readFile("output/letter-generation-test-stats.csv", "utf8", (err, data) => {
  if (err) {
    console.error("failed reading letter-generation-test-stats.csv", err);
    process.exit(1);
  }

  let failure = false;
  data
    .split("\n")
    .map(row => {
      let [operation, status, latency] = row.split(",");
      return { operation, status, latency };
    })
    .filter(res => res.operation && res.operation !== "operation")
    .forEach(res => {
      let threshold = THRESHOLDS.DEFAULT;
      if (THRESHOLDS[res.operation]) {
        threshold = THRESHOLDS[res.operation];
      }

      if (res.latency > threshold) {
        failure = true;
        console.error(
          `ERROR - operation: ${res.operation} took ${res.latency}ms, which is above its threshold of ${threshold}ms`
        );
      } else {
        console.log(
          `operation: ${res.operation} passed its threshold (${res.latency}ms < ${threshold}ms)`
        );
      }
    });

  if (failure) {
    console.error("latency validation failed (see above)");
    process.exit(1);
  }
});
