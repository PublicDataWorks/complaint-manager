"use strict";
const features = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/features.json`);

let feature = features.find(feat => feat.id === "searchCasesFeature");
if (feature.enabled || feature.criteria?.isPreProd) {
  console.log("elasticsearch enabled");
  process.exit(1);
} else {
  console.log("elasticsearch disabled");
  process.exit();
}
