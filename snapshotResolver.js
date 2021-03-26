'use strict';

const testPathForConsistencyCheck = '/app/src/client/policeDataManager/officers/OfficerSearch/OfficerSearchResults/OfficerSearchResultsRow.test.js';

const resolveSnapshotPath = (testPath, snapshotExtension) => {
  return testPath.replace('src', 'src/instance-files/snapshots') + snapshotExtension;
};

const resolveTestPath = (snapshotFilePath, snapshotExtension) => {
  return snapshotFilePath.replace('src/instance-files/snapshots', 'src').slice(0, -snapshotExtension.length);
};

module.exports = {
  resolveSnapshotPath,
  resolveTestPath,
  testPathForConsistencyCheck
};
