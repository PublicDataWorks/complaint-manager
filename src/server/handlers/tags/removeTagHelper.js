import models from "../../policeDataManager/models";
import Boom from "boom";
import {
  NOT_FOUND_ERRORS
} from "../../../sharedUtilities/errorMessageConstants";

const removeTagAndAuditDetails = async (request, id) => {
    await models.case_tag.destroy({
      where: {
        tagId: id,
      },
      auditUser: request.nickname
    })

  let destroyResult = await models.tag.destroy(
    {
      where: { id: id },
      auditUser: request.nickname
    }
  );

  if (destroyResult <= 0) {
    throw Boom.notFound(NOT_FOUND_ERRORS.RESOURCE_NOT_FOUND);
  } 
 };

export default removeTagAndAuditDetails;
