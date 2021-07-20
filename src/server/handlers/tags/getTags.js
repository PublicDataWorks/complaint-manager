import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";
import { ASCENDING, DESCENDING } from "../../../sharedUtilities/constants";
import {
  getTagsAndAuditDetails,
  getTagsWithCountAndAuditDetails
} from "./getTagsHelper";

const getTags = asyncMiddleware(async (request, response, next) => {
  const { tags, auditDetails } =
    request.param("expand") === "count"
      ? await getTagsWithCount(request)
      : await getTagsAndAuditDetails();

  response.status(200).send(tags);
});

const getTagsWithCount = async request => {
  let sortBy, sortDirection;
  if (request.param("sort")) {
    // expects comma separated list of search terms with . notation for order e.g. count,desc.name
    let term = request.param("sort").split(",")[0].split(".");
    if (term.length >= 2) {
      sortBy = term[1];
      sortDirection = term[0];
    } else if (term.length) {
      sortBy = term[0];
    }
  }
  return await getTagsWithCountAndAuditDetails(sortBy, sortDirection);
};

export default getTags;
