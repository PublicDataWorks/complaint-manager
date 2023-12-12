import Boom from "boom";
import models from "../../policeDataManager/models";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";

export const getRuleChapterId = async request => {
  let ruleChapter;
  if (request.body.ruleChapterId) {
    ruleChapter = await models.ruleChapter.findByPk(request.body.ruleChapterId);
    if (!ruleChapter) {
      throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_RULE_CHAPTER);
    }
  } else if (request.body.ruleChapterName) {
    ruleChapter = await models.ruleChapter.create({
      name: request.body.ruleChapterName
    });
  }

  return ruleChapter?.id;
};

export const getDirectiveId = async request => {
  // if directive does not have and id yet, it gets one here
  let directive;
  if (!request.body.directiveId) {
    directive = await models.directive.findByPk(request.body.directiveId);
    if (!directive) {
      throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_DIRECTIVE);
    }
  }

  return directive?.id;
};
