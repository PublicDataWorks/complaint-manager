import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import asyncMiddleware from "../asyncMiddleware";
import auditDataAccess from "../audits/auditDataAccess";
import models from "../../policeDataManager/models";
import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";

const getLetterImages = asyncMiddleware(async (request, response, next) => {
  const queryOptions = {
    attributes: ["id", "image"]
  };
  let letterImages = await models.letterImage.findAll(queryOptions);

  auditDataAccess(
    request.nickname,
    null,
    MANAGER_TYPE.COMPLAINT,
    AUDIT_SUBJECT.LETTER_IMAGES,
    getQueryAuditAccessDetails(queryOptions, models.letterImage.image),
    null
  );

  console.log("letterImages>>>>", letterImages);
  response.status(200).send(letterImages);
});

export default getLetterImages;
