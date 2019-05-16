import _ from "lodash";

export const removeFromExistingAuditDetails = (
  existingDetails,
  detailsToRemove
) => {};

export const addToExistingAuditDetails = (existingDetails, detailsToAdd) => {
  existingDetails["mockAssociation"] = {
    attributes: ["mockDetails"],
    model: "mockModelName"
  };
};

export const generateAndAddAuditDetailsFromQuery = (
  existingDetails,
  queryOptions,
  topLevelModelName
) => {
  existingDetails[_.camelCase(topLevelModelName)] = {
    attributes: ["mockDetails"],
    model: topLevelModelName
  };
};
