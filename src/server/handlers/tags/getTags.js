import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import asyncMiddleware from "../asyncMiddleware";
import auditDataAccess from "../audits/auditDataAccess";
import {
  getTagsAndAuditDetails,
  getTagsWithCountAndAuditDetails
} from "./getTagsHelper";

const getTags = asyncMiddleware(async (request, response, next) => {
  const { tags, auditDetails } =
    request.params.expand === "count"
      ? await getTagsWithCount(request)
      : await getTagsAndAuditDetails();

  auditDataAccess(
    request.nickname,
    null,
    MANAGER_TYPE.COMPLAINT,
    AUDIT_SUBJECT.ALL_TAGS,
    auditDetails,
    null
  );

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
    } else {
      sortBy = term[0];
    }
  }
  return await getTagsWithCountAndAuditDetails(sortBy, sortDirection);
};

export default getTags;
