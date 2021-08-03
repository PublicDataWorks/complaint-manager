import models from "../../policeDataManager/models";
import Boom from "boom";
import {
  BAD_REQUEST_ERRORS,
  NOT_FOUND_ERRORS
} from "../../../sharedUtilities/errorMessageConstants";

const editTagAndAuditDetails = async (request, id, tag) => {
  let matchingTags = await models.tag.findAll({
    where: { name: tag.name }
  });

  if (matchingTags.length) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.TAG_WITH_NAME_EXISTS);
  }

  let updateResult = await models.tag.update(
    { name: tag.name },
    {
      where: { id: id },
      auditUser: request.nickname
    }
  ); // should return an array with two elements [the # of rows updated, an array with each updated element] e.g. [0, []] if no update

  if (updateResult[0] <= 0) {
    throw Boom.notFound(NOT_FOUND_ERRORS.RESOURCE_NOT_FOUND);
  } else {
    let { id, name } = updateResult[1][0];
    return { id, name };
  }
};

export default editTagAndAuditDetails;
