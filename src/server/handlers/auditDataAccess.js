import models from "../models";
import { AUDIT_ACTION, AUDIT_TYPE } from "../../sharedUtilities/constants";
import _ from "lodash";

const auditDataAccess = async (
  user,
  caseId,
  subject,
  transaction,
  action = AUDIT_ACTION.DATA_ACCESSED,
  auditDetails
) => {
  let formattedAuditDetails = {};
  if (auditDetails) {
    formattedAuditDetails = formatAuditDetails(auditDetails);
  }

  await models.action_audit.create(
    {
      user,
      caseId,
      action,
      auditType: AUDIT_TYPE.DATA_ACCESS,
      subject,
      auditDetails: formattedAuditDetails
    },
    { transaction }
  );
};

export const formatAuditDetails = auditDetails => {
  let formattedAuditDetails = {};

  Object.keys(auditDetails).forEach(subjectName => {
    const subject = auditDetails[subjectName];

    if (_.isArray(subject)) {
      formattedAuditDetails[subjectName] = subject;
    } else {
      const modelName = subject.model ? subject.model : subjectName;
      const prettySubjectName = models[subjectName]
        ? _.startCase(models[subjectName].options.name.singular)
        : _.startCase(subjectName);

      let {
        allAttributesPresent,
        extraAttributes
      } = getExtraAttributesIfAllModelAttributesPresent(
        subject.attributes,
        modelName
      );

      if (allAttributesPresent) {
        formattedAuditDetails[prettySubjectName] = [
          `All ${prettySubjectName} Data`,
          ...extraAttributes
        ];
      } else {
        formattedAuditDetails[prettySubjectName] = subject.attributes.map(
          attribute => {
            return _.startCase(attribute);
          }
        );
      }
    }
  });
  return formattedAuditDetails;
};

const getExtraAttributesIfAllModelAttributesPresent = (
  attributes,
  modelName
) => {
  const sortedAuditAttributes = attributes;
  const sortedModelAttributes = Object.keys(models[modelName].rawAttributes);

  let extraAttributes = [];
  let allAttributesPresent = true;

  sortedModelAttributes.sort();
  sortedAuditAttributes.sort();

  let modelAttributesIndex = 0;
  let auditAttributesIndex = 0;
  while (
    modelAttributesIndex < sortedModelAttributes.length &&
    auditAttributesIndex < sortedAuditAttributes.length
  ) {
    if (
      attributeIsInBothAuditAndModel(
        modelAttributesIndex,
        auditAttributesIndex,
        sortedModelAttributes,
        sortedAuditAttributes
      )
    ) {
      modelAttributesIndex++;
      auditAttributesIndex++;
    } else if (
      auditDetailsDoesNotContainModelAttribute(
        modelAttributesIndex,
        auditAttributesIndex,
        sortedModelAttributes,
        sortedAuditAttributes
      )
    ) {
      allAttributesPresent = false;
      break;
    } else {
      extraAttributes.push(
        _.startCase(sortedAuditAttributes[auditAttributesIndex])
      );
      auditAttributesIndex++;
    }
  }
  return {
    allAttributesPresent: allAttributesPresent,
    extraAttributes: allAttributesPresent ? extraAttributes : []
  };
};

const attributeIsInBothAuditAndModel = (
  modelAttributesIndex,
  attributesIndex,
  sortedModelAttributes,
  sortedAttributes
) => {
  return (
    sortedModelAttributes[modelAttributesIndex] ===
    sortedAttributes[attributesIndex]
  );
};

const auditDetailsDoesNotContainModelAttribute = (
  modelAttributesIndex,
  attributesIndex,
  sortedModelAttributes,
  sortedAttributes
) => {
  return (
    sortedModelAttributes[modelAttributesIndex] <
    sortedAttributes[attributesIndex]
  );
};

export default auditDataAccess;
