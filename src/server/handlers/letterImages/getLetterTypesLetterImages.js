import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import asyncMiddleware from "../asyncMiddleware";
import auditDataAccess from "../audits/auditDataAccess";
import models from "../../policeDataManager/models";
import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";

const getLetterTypesLetterImages = asyncMiddleware(
  async (request, response, next) => {
    const queryOptions = {
      attributes: ["id", "imageId", "letterId", "maxWidth", "name"]
    };
    let letterTypesLetterImages = await models.letterTypeLetterImage.findAll(
      queryOptions
    );

    auditDataAccess(
      request.nickname,
      null,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.LETTER_TYPES_LETTER_IMAGES,
      getQueryAuditAccessDetails(
        queryOptions,
        models.letterTypeLetterImage.name
      ),
      null
    );

    response.status(200).send(letterTypesLetterImages);
  }
);

export default getLetterTypesLetterImages;
