import _ from "lodash";
import models from "../../models";

export const legacyFormatAuditDetails = auditDetails => {
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

      let attributeData;

      if (models[modelName]) {
        attributeData = getExtraAttributesIfAllModelAttributesPresent(
          subject.attributes,
          modelName
        );
      }

      if (attributeData && attributeData.allAttributesPresent) {
        formattedAuditDetails[prettySubjectName] = [
          `All ${prettySubjectName} Data`,
          ...attributeData.extraAttributes
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
  let extraAttributes = [];
  let allAttributesPresent = true;

  const sortedAuditAttributes = attributes;
  const sortedModelAttributes = Object.keys(models[modelName].rawAttributes);

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