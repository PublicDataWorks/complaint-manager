import _ from "lodash";

export const removeFromExistingAuditDetails = jest.fn(
  (existingDetails, detailsToRemove) => {
    return {
      mockAssociation: {
        attributes: ["mockDetails"],
        model: "mockModelName"
      }
    };
  }
);

export const combineAuditDetails = jest.fn((existingDetails, detailsToAdd) => {
  return {
    mockAssociation: {
      attributes: ["mockDetails"],
      model: "mockModelName"
    }
  };
});

const getQueryAuditAccessDetails = jest.fn(
  (queryOptions, topLevelModelName) => {
    return {
      [_.camelCase(topLevelModelName)]: {
        attributes: ["mockDetails"],
        model: topLevelModelName
      }
    };
  }
);

export default getQueryAuditAccessDetails;
