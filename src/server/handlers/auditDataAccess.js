import models from "../models";
import { AUDIT_ACTION, AUDIT_TYPE } from "../../sharedUtilities/constants";
import _ from "lodash";

const getExtraAttributesIfAllAttributesPresent = (attributes, modelName) => {
  const sortedAttributes = attributes;
  const sortedModelAttributes = Object.keys(models[modelName].rawAttributes);

  let extraAttributes = [];

  sortedModelAttributes.sort();
  sortedAttributes.sort();

  let modelAttributesIndex = 0;
  let attributesIndex = 0;
  while (
    modelAttributesIndex < sortedModelAttributes.length &&
    attributesIndex < sortedAttributes.length
  ) {
    if (
      sortedModelAttributes[modelAttributesIndex] ===
      sortedAttributes[attributesIndex]
    ) {
      modelAttributesIndex++;
      attributesIndex++;
    } else if (
      sortedModelAttributes[modelAttributesIndex] <
      sortedAttributes[attributesIndex]
    ) {
      return false;
    } else {
      extraAttributes.push(_.startCase(sortedAttributes[attributesIndex]));
      attributesIndex++;
    }
  }
  return extraAttributes;
};

export const formatSubjectDetails = subjectDetails => {
  let formattedSubjectDetails = {};

  Object.keys(subjectDetails).forEach(subjectName => {
    const subject = subjectDetails[subjectName];

    if (!_.isArray(subject)) {
      const modelName = subject.model ? subject.model : subjectName;
      const prettySubjectName = models[subjectName]
        ? _.startCase(models[subjectName].options.name.singular)
        : _.startCase(subjectName);

      let extraAttributes = getExtraAttributesIfAllAttributesPresent(
        subject.attributes,
        modelName
      );

      if (extraAttributes) {
        formattedSubjectDetails[prettySubjectName] = [
          `All ${prettySubjectName} Data`,
          ...extraAttributes
        ];
      } else {
        formattedSubjectDetails[prettySubjectName] = subject.attributes.map(
          attribute => {
            return _.startCase(attribute);
          }
        );
      }
    } else {
      formattedSubjectDetails[subjectName] = subject;
    }
  });
  return formattedSubjectDetails;
};

const auditDataAccess = async (
  user,
  caseId,
  subject,
  transaction,
  action = AUDIT_ACTION.DATA_ACCESSED,
  subjectDetails
) => {
  let formattedSubjectDetails = {};
  if (subjectDetails) {
    formattedSubjectDetails = formatSubjectDetails(subjectDetails);
  }

  await models.action_audit.create(
    {
      user,
      caseId,
      action,
      auditType: AUDIT_TYPE.DATA_ACCESS,
      subject,
      subjectDetails: formattedSubjectDetails
    },
    { transaction }
  );
};

export default auditDataAccess;
