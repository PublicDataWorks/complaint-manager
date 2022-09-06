import Boom from "boom";
import models from "../../policeDataManager/models";
import auditDataAccess from "../audits/auditDataAccess";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";
import { BAD_DATA_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import { getTagsAndAuditDetails } from "../tags/getTagsHelper";
import { updateCaseToActiveIfInitial } from "./helpers/caseStatusHelpers";

const asyncMiddleware = require("../asyncMiddleware");

const createCaseTag = asyncMiddleware(async (request, response, next) => {
  await validateTag(request);

  const caseId = request.params.caseId;
  let tagId = request.body.tagId;

  const updatedCaseTags = await models.sequelize.transaction(
    async transaction => {
      if (!tagId) {
        const tag = await models.tag.create(
          {
            name: request.body.tagName
          },
          {
            auditUser: request.nickname
          }
        );
        tagId = tag.id;
      }

      await models.case_tag.create(
        {
          tagId: tagId,
          caseId: caseId
        },
        {
          auditUser: request.nickname,
          transaction
        }
      );

      await updateCaseToActiveIfInitial(
        request.params.caseId,
        request.nickname,
        transaction
      );

      const caseTagsAndAuditDetails = await getCaseTagsAndAuditDetails(
        request.params.caseId,
        transaction
      );
      const tagsAndAuditDetails = await getTagsAndAuditDetails(transaction);

      const caseTags = caseTagsAndAuditDetails.caseTags;
      const caseTagAuditDetails = caseTagsAndAuditDetails.auditDetails;
      const tags = tagsAndAuditDetails.tags;
      const tagAuditDetails = tagsAndAuditDetails.auditDetails;

      await auditDataAccess(
        request.nickname,
        request.params.caseId,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.CASE_TAGS,
        caseTagAuditDetails,
        transaction
      );
      await auditDataAccess(
        request.nickname,
        null,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.ALL_TAGS,
        tagAuditDetails,
        transaction
      );

      return { caseTags: caseTags, tags: tags };
    }
  );

  response.status(200).send(updatedCaseTags);
});

const checkForExistingTagName = async tagName => {
  const existingTag = await models.tag.findOne({
    where: {
      name: tagName
    }
  });

  if (existingTag) {
    throw Boom.badData(BAD_DATA_ERRORS.CANNOT_CREATE_DUPLICATE_TAG);
  }
};

const checkIfTagExistsOnCase = async (caseId, tagId) => {
  const existingCaseTag = await models.case_tag.findOne({
    where: {
      caseId: caseId,
      tagId: tagId
    }
  });

  if (existingCaseTag) {
    throw Boom.badData(BAD_DATA_ERRORS.TAG_ALREADY_EXISTS_ON_CASE);
  }
};

const validateTag = async request => {
  if (!request.body.tagId && !request.body.tagName) {
    throw Boom.badData(BAD_DATA_ERRORS.MISSING_TAG_PARAMETERS);
  } else if (!request.body.tagId) {
    await checkForExistingTagName(request.body.tagName);
  } else {
    await checkIfTagExistsOnCase(request.params.caseId, request.body.tagId);
  }
};

const getCaseTagsAndAuditDetails = async (caseId, transaction) => {
  const caseTagQueryOptions = {
    where: {
      caseId: caseId
    },
    include: [
      {
        model: models.tag,
        as: "tag"
      }
    ],
    transaction
  };

  const caseTags = await models.case_tag.findAll(caseTagQueryOptions);

  const caseTagAuditDetails = getQueryAuditAccessDetails(
    caseTagQueryOptions,
    models.case_tag.name
  );

  return { caseTags: caseTags, auditDetails: caseTagAuditDetails };
};

export default createCaseTag;
