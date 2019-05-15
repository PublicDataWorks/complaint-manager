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

export const addToExistingAuditDetails = (existingDetails, detailsToAdd) => {
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

export const generateAndAddAuditDetailsFromQuery = (
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

  addToExistingAuditDetails(existingDetails, detailsToAdd);
};

const combineAttributes = (existingDetails, detailsToAdd) => {
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

const getAttributeName = attribute => {
  if (_.isArray(attribute) && attribute.length === 2) {
    return attribute[1];
  }
  return attribute;
};

const getQueryAuditAccessDetailsHelper = (
  queryOptions,
  associationName,
  modelName,
  auditDetails
) => {
  let attributes;

  if (queryOptions && queryOptions.attributes) {
    attributes = queryOptions.attributes.map(attribute => {
      return getAttributeName(attribute);
    });
  } else {
    attributes = Object.keys(models[modelName].rawAttributes);
  }

  const formattedAssociationName = _.camelCase(associationName);

  auditDetails[formattedAssociationName] = {
    attributes: attributes,
    model: modelName
  };

  if (queryOptions && queryOptions.include) {
    recursivelyAddIncludedModelsToAuditDetails(queryOptions, auditDetails);
  }
};

const isModelObjectWithNoQueryOptions = includedModel => {
  return !!(includedModel.name && models[includedModel.name]);
};

const hasAssociationAlias = includedModel => {
  return !!includedModel.as;
};

const recursivelyAddIncludedModelsToAuditDetails = (
  queryOptions,
  auditDetails
) => {
  queryOptions.include.map(includedModel => {
    let queryOptionsOfIncludedModel;
    let associationName;
    let modelName;

    if (isModelObjectWithNoQueryOptions(includedModel)) {
      queryOptionsOfIncludedModel = null;
      associationName = includedModel.name;
      modelName = includedModel.name;
    } else if (hasAssociationAlias(includedModel)) {
      queryOptionsOfIncludedModel = includedModel;
      associationName = includedModel.as;
      modelName = includedModel.model.name;
    } else {
      queryOptionsOfIncludedModel = includedModel;
      associationName = includedModel.model.name;
      modelName = includedModel.model.name;
    }

    getQueryAuditAccessDetailsHelper(
      queryOptionsOfIncludedModel,
      associationName,
      modelName,
      auditDetails
    );
  });
};

const allAttributesArePresent = (attributes, modelName) => {
  return _.isEqual(attributes, Object.keys(models[modelName].rawAttributes));
};

export default getQueryAuditAccessDetails;
