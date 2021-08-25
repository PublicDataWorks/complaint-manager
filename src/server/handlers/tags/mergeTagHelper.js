import models, { sequelize } from "../../policeDataManager/models";
import Boom from "boom";
import {
  NOT_FOUND_ERRORS,
  BAD_REQUEST_ERRORS
} from "../../../sharedUtilities/errorMessageConstants";

const mergeTagAndAuditDetails = async (request, deleteTagId, mergeTagId) => {
  let deleteTagPromise = models.tag.findOne({ where: { id: deleteTagId } });
  let mergeTagPromise = models.tag.findOne({ where: { id: mergeTagId } });

  let deleteTag = await deleteTagPromise;
  if (!deleteTag) {
    throw Boom.badRequest(NOT_FOUND_ERRORS.RESOURCE_NOT_FOUND);
  }

  let mergeTag = await mergeTagPromise;
  if (!mergeTag) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.MERGE_TAG_DOES_NOT_EXIST);
  }

  let mergeTagCases = await models.case_tag.findAll({
    where: {
      tagId: mergeTagId
    }
  });

  await sequelize.transaction({}, async transaction => {
    await models.case_tag.destroy({
      where: {
        tagId: deleteTagId,
        caseId: mergeTagCases.map(caseTag => caseTag.caseId)
      },
      auditUser: request.nickname,
      transaction
    });

    await models.case_tag.update(
      { tagId: mergeTagId },
      {
        where: {
          tagId: deleteTagId
        },
        auditUser: request.nickname,
        transaction
      }
    );

    await models.tag.destroy({
      where: {
        id: deleteTagId
      },
      auditUser: request.nickname,
      transaction
    });
  });
};

export default mergeTagAndAuditDetails;
