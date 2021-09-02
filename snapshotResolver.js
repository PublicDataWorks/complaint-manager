"use strict";

const snapshots = `${process.env.REACT_APP_INSTANCE_FILES_DIR}/snapshots`;
const root = process.env.CIRCLECI ? "/root/project/src" : "/app/src";

const testPathForConsistencyCheck =
  root +
  "/client/policeDataManager/officers/OfficerSearch/OfficerSearchResults/OfficerSearchResultsRow.test.js";

const resolveSnapshotPath = (testPath, snapshotExtension) => {
  const post = testPath.substring(testPath.indexOf("src") + 3);
  const snapshotPath = snapshots + post + snapshotExtension;
  return snapshotPath;
};

const resolveTestPath = (snapshotFilePath, snapshotExtension) => {
  return snapshotFilePath
    .replace(snapshots, root)
    .slice(0, -snapshotExtension.length);
};

module.exports = {
  resolveSnapshotPath,
  resolveTestPath,
  testPathForConsistencyCheck
};
