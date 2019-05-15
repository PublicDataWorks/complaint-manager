import { cleanupDatabase } from "../testHelpers/requestTestHelpers";

import models from "../models";
import getQueryAuditAccessDetails, {
  generateAndAddAuditDetailsFromQuery,
  removeFromExistingAuditDetails
} from "./getQueryAuditAccessDetails";
import { ALL_AUDIT_DATA } from "../../sharedUtilities/constants";

describe("audit details", () => {
  describe("getQueryAuditDetails", () => {
    let existingCase;

    afterEach(async () => {
      await cleanupDatabase();
    });

    test("should add attributes for non-object model in include", () => {
      const detailsToAdd = {
        include: [
          {
            model: models.civilian,
            as: "complainantCivilians",
            include: [models.address]
          }
        ]
      };

      expect(
        getQueryAuditAccessDetails(detailsToAdd, models.cases.name)
      ).toEqual(
        expect.objectContaining({
          address: {
            attributes: expect.arrayContaining(["intersection"])
          }
        })
      );
    });

    test("gets options", async () => {
      const topLevelModelName = models.cases.name;
      const queryOptions = {
        attributes: [
          ["id", "caseId"],
          "incidentDate",
          "incidentTime",
          "narrativeDetails",
          "firstContactDate",
          "complaintType",
          "year",
          "caseNumber",
          "pibCaseNumber"
        ],
        include: [
          {
            model: models.referral_letter,
            as: "referralLetter",
            include: [
              {
                model: models.referral_letter_iapro_correction,
                as: "referralLetterIAProCorrections"
              }
            ]
          },
          { model: models.classification },
          {
            model: models.address,
            as: "incidentLocation"
          },
          {
            model: models.civilian,
            as: "complainantCivilians",
            include: [
              { model: models.address },
              { model: models.race_ethnicity, as: "raceEthnicity" }
            ]
          },
          {
            model: models.civilian,
            as: "witnessCivilians"
          },
          {
            model: models.case_officer,
            as: "complainantOfficers",
            attributes: ["id"]
          },
          {
            model: models.case_officer,
            as: "accusedOfficers",
            separate: true,
            include: [
              {
                model: models.officer_allegation,
                as: "allegations",
                include: [{ model: models.allegation }]
              },
              {
                model: models.letter_officer,
                as: "letterOfficer",
                include: [
                  {
                    model: models.referral_letter_officer_history_note,
                    as: "referralLetterOfficerHistoryNotes",
                    separate: true
                  },
                  {
                    model: models.referral_letter_officer_recommended_action,
                    as: "referralLetterOfficerRecommendedActions",
                    separate: true,
                    include: [
                      {
                        model: models.recommended_action,
                        as: "recommendedAction"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            model: models.case_officer,
            as: "witnessOfficers"
          }
        ]
      };

      expect(
        getQueryAuditAccessDetails(queryOptions, topLevelModelName)
      ).toEqual(
        expect.objectContaining({
          cases: {
            attributes: expect.arrayContaining([
              "incidentDate",
              "incidentTime",
              "narrativeDetails",
              "firstContactDate",
              "complaintType",
              "year",
              "caseNumber",
              "pibCaseNumber"
            ])
          },
          complainantOfficers: {
            attributes: ["id"],
            model: models.case_officer.name
          },
          recommendedAction: {
            attributes: ["id", "description", "createdAt", "updatedAt"],
            model: models.recommended_action.name
          }
        })
      );
    });

    test("should retain model when combining attributes", () => {
      const auditDetailsBefore = {
        incidentLocation: {
          attributes: [
            "id",
            "addressableId",
            "addressableType",
            "streetAddress",
            "intersection",
            "streetAddress2",
            "city",
            "state",
            "zipCode",
            "country",
            "lat",
            "lng",
            "placeId",
            "additionalLocationInfo",
            "createdAt",
            "updatedAt",
            "deletedAt"
          ],
          model: "address"
        },
        complainantCivilians: {
          attributes: [
            "id",
            "firstName",
            "middleInitial",
            "lastName",
            "suffix",
            "birthDate",
            "roleOnCase",
            "genderIdentity",
            "phoneNumber",
            "email",
            "additionalInfo",
            "title",
            "isAnonymous",
            "createdAt",
            "updatedAt",
            "deletedAt",
            "caseId",
            "raceEthnicityId"
          ],
          model: "civilian"
        }
      };

      const queryOptions = {
        paranoid: false,
        include: [
          {
            model: models.civilian,
            as: "complainantCivilians",
            include: [
              models.address,
              { model: models.race_ethnicity, as: "raceEthnicity" }
            ]
          },
          {
            model: models.address,
            as: "incidentLocation"
          }
        ]
      };

      generateAndAddAuditDetailsFromQuery(
        auditDetailsBefore,
        queryOptions,
        models.cases.name
      );

      expect(auditDetailsBefore).toEqual(
        expect.objectContaining({
          complainantCivilians: {
            attributes: expect.arrayContaining([expect.anything()]),
            model: models.civilian.name
          },
          incidentLocation: {
            attributes: expect.arrayContaining([expect.anything()]),
            model: models.address.name
          }
        })
      );
    });
  });

  describe("generateAndAddAuditDetailsFromQuery", () => {
    test("should generate audit details from queryOptions and add to existingDetails if existingDetails are empty", () => {
      const queryOptions = {
        attributes: ["id", "status"]
      };

      let existingDetails = {};

      generateAndAddAuditDetailsFromQuery(
        existingDetails,
        queryOptions,
        models.cases.name
      );

      expect(existingDetails).toEqual({
        cases: {
          attributes: ["id", "status"]
        }
      });
    });

    test("should generate audit details from queryOptions and add to existingDetails if existingDetails has data already", () => {
      const queryOptions = {
        attributes: ["id", "status"]
      };

      let existingDetails = {
        complainantCivilians: { attributes: ["id", "firstName"] }
      };

      generateAndAddAuditDetailsFromQuery(
        existingDetails,
        queryOptions,
        models.cases.name
      );

      expect(existingDetails).toEqual({
        cases: { attributes: ["id", "status"] },
        complainantCivilians: { attributes: ["id", "firstName"] }
      });
    });

    test("should generate audit details from queryOptions and add to existingDetails if there are overlapping subjects", () => {
      const existingDetails = {
        cases: { attributes: ["id", "status"] }
      };

      const queryOptions = { attributes: ["incidentDate"] };
      generateAndAddAuditDetailsFromQuery(
        existingDetails,
        queryOptions,
        models.cases.name
      );

      expect(existingDetails).toEqual({
        cases: { attributes: ["id", "status", "incidentDate"] }
      });
    });

    test("should not have duplicates if combining overlapping subject", () => {
      const existingDetails = {
        cases: { attributes: ["id", "status"] }
      };

      const queryOptions = {
        attributes: ["id", "incidentDate"]
      };

      generateAndAddAuditDetailsFromQuery(
        existingDetails,
        queryOptions,
        models.cases.name
      );

      expect(existingDetails.cases.attributes.length).toEqual(3);
    });
  });

  describe("removeFromExistingAuditDetails", () => {
    test("should remove specified fields from audit details", () => {
      const existingDetails = {
        cases: {
          attributes: ["id", "incidentDate", "incidentTime"]
        },
        civilianComplainants: {
          attributes: ["firstName", "lastName"],
          model: "civilian"
        },
        accusedOfficers: {
          attributes: ["officerId"],
          model: models.case_officer.name
        }
      };

      const detailsToRemove = {
        cases: ["id"],
        civilianComplainants: ["firstName"],
        accusedOfficers: ["officerId"]
      };

      removeFromExistingAuditDetails(existingDetails, detailsToRemove);

      expect(existingDetails).toEqual({
        cases: { attributes: ["incidentDate", "incidentTime"] },
        civilianComplainants: {
          attributes: ["lastName"],
          model: "civilian"
        }
      });
    });
  });
});
