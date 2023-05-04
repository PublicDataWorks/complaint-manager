import { updateSearchIndex } from "../../../../sharedUtilities/search/searchUtilities";
import asyncMiddleware from "../../asyncMiddleware";

const updateSearchIndexHandler = asyncMiddleware((request, response) => {
  updateSearchIndex();
  response.status(202).send("Search index update started...");
});

export default updateSearchIndexHandler;
