import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";

import models from "../../policeDataManager/models";
import getQueryAuditAccessDetails, {
  combineAuditDetails,
  removeFromExistingAuditDetails
} from "./getQueryAuditAccessDetails";

describe("audit details", () => {
  describe("getQueryAuditDetails", () => {
    let existingCase;

    afterEach(async () => {
      await cleanupDatabase();
    });

    afterAll(async () => {
      await models.sequelize.close();
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
            attributes: expect.arrayContaining(["intersection"]),
            model: models.address.name
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
          "incidentTimezone",
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
            as: "referralLetter"
          },
          { model: models.case_classification, as: "caseClassifications" },
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
              "incidentTimezone",
              "narrativeDetails",
              "firstContactDate",
              "complaintType",
              "year",
              "caseNumber",
              "pibCaseNumber"
            ]),
            model: models.cases.name
          },
          complainantOfficers: {
            attributes: ["id"],
            model: models.case_officer.name
          },
          recommendedAction: {
            attributes: ["id", "description", "createdAt", "updatedAt"],
            model: models.recommended_action.name
          },
          caseClassifications: {
            attributes: expect.toIncludeSameMembers(
              Object.keys(models.case_classification.rawAttributes)
            ),
            model: models.case_classification.name
          }
        })
      );
    });
  });

  describe("combineAuditDetails", () => {
    test("combines audit details when first set of audit details is empty", () => {
      const firstAuditDetails = {};

      const secondAuditDetails = {
        cases: {
          attributes: ["id", "status"],
          model: models.cases.name
        }
      };

      const combinedAuditDetails = combineAuditDetails(
        firstAuditDetails,
        secondAuditDetails
      );

      expect(combinedAuditDetails).toEqual(secondAuditDetails);
    });

    test("combines audit details when second set of audit details is empty", () => {
      const secondAuditDetails = {};

      const firstAuditDetails = {
        cases: {
          attributes: ["id", "status"],
          model: models.cases.name
        }
      };

      const combinedAuditDetails = combineAuditDetails(
        firstAuditDetails,
        secondAuditDetails
      );

      expect(combinedAuditDetails).toEqual(firstAuditDetails);
    });

    test("combines audit details when same association has different attributes", () => {
      const firstAuditDetails = {
        cases: {
          attributes: ["firstContactDate"],
          model: models.cases.name
        }
      };

      const secondAuditDetails = {
        cases: {
          attributes: ["id", "status"],
          model: models.cases.name
        }
      };

      const combinedAuditDetails = combineAuditDetails(
        firstAuditDetails,
        secondAuditDetails
      );

      expect(combinedAuditDetails).toEqual({
        cases: {
          attributes: ["firstContactDate", "id", "status"],
          model: models.cases.name
        }
      });
    });

    test("combines audit details when same association has repeated attributes", () => {
      const firstAuditDetails = {
        cases: {
          attributes: ["status"],
          model: models.cases.name
        }
      };

      const secondAuditDetails = {
        cases: {
          attributes: ["id", "status"],
          model: models.cases.name
        }
      };

      const combinedAuditDetails = combineAuditDetails(
        firstAuditDetails,
        secondAuditDetails
      );

      expect(combinedAuditDetails).toEqual({
        cases: {
          attributes: ["status", "id"],
          model: models.cases.name
        }
      });
    });

    test("should combine audit details that have two different associations", () => {
      const firstAuditDetails = {
        cases: {
          attributes: ["id", "status"],
          model: models.cases.name
        }
      };

      const secondAuditDetails = {
        accusedOfficer: {
          attributes: ["id", "firstName"],
          model: models.case_officer.name
        }
      };

      const combinedAuditDetails = combineAuditDetails(
        firstAuditDetails,
        secondAuditDetails
      );

      expect(combinedAuditDetails).toEqual({
        cases: {
          attributes: ["id", "status"],
          model: models.cases.name
        },
        accusedOfficer: {
          attributes: ["id", "firstName"],
          model: models.case_officer.name
        }
      });
    });
  });

  test("combines referral letter as top level model and association", () => {
    const referralLetterTopLevelModel = models.referral_letter.name;
    const referralLetterQueryOptions = {};

    const referralLetterAuditDetails = getQueryAuditAccessDetails(
      referralLetterQueryOptions,
      referralLetterTopLevelModel
    );

    const topLevelModel = models.cases.name;
    const caseQueryOptions = {
      include: [{ model: models.referral_letter, as: "referralLetter" }]
    };

    const caseAuditDetails = getQueryAuditAccessDetails(
      caseQueryOptions,
      topLevelModel
    );

    expect(
      combineAuditDetails(referralLetterAuditDetails, caseAuditDetails)
    ).toEqual({
      cases: {
        attributes: Object.keys(models.cases.rawAttributes),
        model: models.cases.name
      },
      referralLetter: {
        attributes: Object.keys(models.referral_letter.rawAttributes),
        model: models.referral_letter.name
      }
    });
  });

  describe("removeFromExistingAuditDetails", () => {
    const existingDetails = {
      cases: {
        attributes: ["id", "incidentDate", "incidentTime"],
        model: models.cases.name
      },
      civilianComplainants: {
        attributes: ["firstName", "lastName"],
        model: models.civilian.name
      },
      accusedOfficers: {
        attributes: ["officerId"],
        model: models.case_officer.name
      }
    };

    test("should retain associations that don't get details removed", () => {
      const detailsToRemove = {
        civilianComplainants: ["firstName"],
        accusedOfficers: ["officerId"]
      };

      const updatedDetails = removeFromExistingAuditDetails(
        existingDetails,
        detailsToRemove
      );

      expect(updatedDetails).toEqual({
        cases: {
          attributes: ["id", "incidentDate", "incidentTime"],
          model: models.cases.name
        },
        civilianComplainants: {
          attributes: ["lastName"],
          model: models.civilian.name
        }
      });
    });

    test("should remove specified fields from audit details", () => {
      const detailsToRemove = {
        cases: ["id"],
        civilianComplainants: ["firstName"],
        accusedOfficers: ["officerId"]
      };

      const updatedDetails = removeFromExistingAuditDetails(
        existingDetails,
        detailsToRemove
      );

      expect(updatedDetails).toEqual({
        cases: {
          attributes: ["incidentDate", "incidentTime"],
          model: models.cases.name
        },
        civilianComplainants: {
          attributes: ["lastName"],
          model: models.civilian.name
        }
      });
    });
  });
});
