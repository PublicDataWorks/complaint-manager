import mockLodash from "lodash";

jest.mock("../../getQueryAuditAccessDetails"), () => ({
    generateAndAddAuditDetailsFromQuery: jest.fn(
        (existingDetails, queryOptions, topLevelModelName) => {
            existingDetails[mockLodash.camelCase(topLevelModelName)] = {
                attributes: ["mockDetails"],
                model: "mockModelName"
            };
        }
    ),
    addToExistingAuditDetails: jest.fn((existingDetails, detailsToAdd) => {
        existingDetails["mockAttribute"] = {
            attributes: ["mockDetails"],
            model: "mockModelName"
        };
    }),
    removeFromExistingAuditDetails: jest.fn()
}));