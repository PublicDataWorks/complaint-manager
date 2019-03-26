import _ from "lodash";
import models from "../models";

export const removeFromExistingAuditDetails = (
  existingDetails,
  detailsToRemove
) => {
  Object.keys(detailsToRemove).forEach(subject => {
    existingDetails[subject].attributes = existingDetails[
      subject
    ].attributes.filter(
      attribute => !detailsToRemove[subject].includes(attribute)
    );
    if (existingDetails[subject].attributes.length === 0) {
      delete existingDetails[subject];
    }
  });
};

export const addToExistingAuditDetails = (
  existingDetails,
  queryOptions,
  topLevelModelName
) => {
  if (existingDetails === null) {
    return;
  }

  const detailsToAdd = getQueryAuditAccessDetails(
    queryOptions,
    topLevelModelName
  );

  Object.keys(detailsToAdd).forEach(subject => {
    if (existingDetails[subject]) {
      existingDetails[subject] = combineAttributes(
        existingDetails[subject],
        detailsToAdd[subject],
        subject
      );
    } else {
      existingDetails[subject] = detailsToAdd[subject];
    }
  });
};

const combineAttributes = (existingDetails, detailsToAdd, subject) => {
  const combinedAttributes = _.uniq([
    ...existingDetails.attributes,
    ...detailsToAdd.attributes
  ]);
  if (existingDetails.model) {
    return {
      attributes: combinedAttributes,
      model: existingDetails.model
    };
  } else {
    return { attributes: combinedAttributes };
  }
};

const getQueryAuditAccessDetails = (queryOptions, topLevelModelName) => {
  let auditDetails = {};

  getQueryAuditAccessDetailsHelper(
    queryOptions,
    topLevelModelName,
    topLevelModelName,
    auditDetails
  );

  return auditDetails;
};

const getQueryAuditAccessDetailsHelper = (
  queryOptions,
  subject,
  modelName,
  auditDetails
) => {
  let attributes;

  if (queryOptions && queryOptions.attributes) {
    attributes = queryOptions.attributes.map(attribute => {
      if (_.isArray(attribute) && attribute.length === 2) {
        return attribute[1];
      }
      return attribute;
    });
  } else {
    attributes = Object.keys(models[modelName].rawAttributes);
  }

  auditDetails[subject] = { attributes: attributes };

  if (!models[subject]) {
    auditDetails[subject].model = modelName;
  }

  if (queryOptions && queryOptions.include) {
    queryOptions.include.map(queryInclude => {
      if (queryInclude.name && models[queryInclude.name]) {
        getQueryAuditAccessDetailsHelper(
          null,
          queryInclude.name,
          queryInclude.name,
          auditDetails
        );
      } else {
        getQueryAuditAccessDetailsHelper(
          queryInclude,
          queryInclude.as ? queryInclude.as : queryInclude.model.name,
          queryInclude.model.name,
          auditDetails
        );
      }
    });
  }
};

const allAttributesArePresent = (attributes, modelName) => {
  return _.isEqual(attributes, Object.keys(models[modelName].rawAttributes));
};

export default getQueryAuditAccessDetails;
