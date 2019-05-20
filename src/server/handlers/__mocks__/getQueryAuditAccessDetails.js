import _ from "lodash";

export const removeFromExistingAuditDetails = jest.fn(
  (existingDetails, detailsToRemove) => {}
);

export const addToExistingAuditDetails = jest.fn(
  (existingDetails, detailsToAdd) => {
    existingDetails["mockAssociation"] = {
      attributes: ["mockDetails"],
      model: "mockModelName"
    };
  }
);

export const generateAndAddAuditDetailsFromQuery = jest.fn(
  (existingDetails, queryOptions, topLevelModelName) => {
    existingDetails[_.camelCase(topLevelModelName)] = {
      attributes: ["mockDetails"],
      model: topLevelModelName
    };
  }
);
