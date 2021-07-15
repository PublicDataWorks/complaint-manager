import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";
import { ASCENDING } from "../../../sharedUtilities/constants";
import {
  getTagsAndAuditDetails,
  getTagsWithCountAndAuditDetails
} from "./getTagsHelper";

const getTags = asyncMiddleware(async (request, response, next) => {
  const { tags } =
    request.param("expand") === "count"
      ? await getTagsWithCountAndAuditDetails()
      : await getTagsAndAuditDetails();

  response.status(200).send(tags);
});

export default getTags;
