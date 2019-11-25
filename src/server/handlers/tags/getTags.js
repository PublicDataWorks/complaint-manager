import asyncMiddleware from "../asyncMiddleware";
import models from "../../complaintManager/models";
import { ASCENDING } from "../../../sharedUtilities/constants";
import getTagsAndAuditDetails from "./getTagsHelper";

const getTags = asyncMiddleware(async (request, response, next) => {
  const { tags, auditDetails } = await getTagsAndAuditDetails();

  response.status(200).send(tags);
});

export default getTags;
