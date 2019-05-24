import _ from "lodash";
import models from "../models";

export const removeFromExistingAuditDetails = (
  existingDetails,
  detailsToRemove
) => {
  const updatedAuditDetails = {};
  Object.keys(existingDetails).forEach(association => {
    const attributesToKeep = existingDetails[association].attributes.filter(
      attribute =>
        attributeShouldNotBeRemoved(association, attribute, detailsToRemove)
    );

    if (attributesToKeep.length > 0) {
      updatedAuditDetails[association] = {
        attributes: attributesToKeep,
        model: existingDetails[association].model
      };
    }
  });
  return updatedAuditDetails;
};

const attributeShouldNotBeRemoved = (
  association,
  attribute,
  detailsToRemove
) => {
  return !(
    detailsToRemove[association] &&
    detailsToRemove[association].includes(attribute)
  );
};

export const combineAuditDetails = (firstAuditDetails, secondAuditDetails) => {
  const combinedDetails = {};

  const associations = Object.keys(secondAuditDetails).concat(
    Object.keys(firstAuditDetails)
  );

  associations.forEach(association => {
    if (firstAuditDetails[association] && secondAuditDetails[association]) {
      combinedDetails[association] = combineAttributes(
        firstAuditDetails[association],
        secondAuditDetails[association],
        association
      );
    } else if (firstAuditDetails[association]) {
      combinedDetails[association] = firstAuditDetails[association];
    } else {
      combinedDetails[association] = secondAuditDetails[association];
    }
  });

  return combinedDetails;
};

const combineAttributes = (firstAuditDetails, secondAuditDetails) => {
  const combinedAttributes = _.uniq([
    ...firstAuditDetails.attributes,
    ...secondAuditDetails.attributes
  ]);

  if (firstAuditDetails.model) {
    return {
      attributes: combinedAttributes,
      model: firstAuditDetails.model
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

export default getQueryAuditAccessDetails;
