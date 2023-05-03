"use strict";

import { updateSearchIndex } from "../../src/sharedUtilities/search/searchUtilities";

updateSearchIndex(true).catch(error => {
  console.error(error);
  process.exit(1);
});
