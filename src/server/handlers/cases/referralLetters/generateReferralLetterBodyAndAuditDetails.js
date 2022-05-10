import models from "../../../policeDataManager/models";
import fs from "fs";
import Handlebars from "handlebars";
import { ASCENDING } from "../../../../sharedUtilities/constants";
import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";

export const getReferralLetterCaseDataAndAuditDetails = async (
  caseId,
  transaction
) => {
  const queryOptions = {
    attributes: [
      "id",
      "incidentDate",
      "incidentTime",
      "incidentTimezone",
      "narrativeDetails",
      "firstContactDate",
      "complaintType",
      "year",
      "caseNumber",
      "pibCaseNumber",
      "caseReference"
    ],
    order: [
      [
        { model: models.case_officer, as: "complainantOfficers" },
        "createdAt",
        ASCENDING
      ],
      [
        { model: models.civilian, as: "complainantCivilians" },
        "createdAt",
        ASCENDING
      ],
      [
        { model: models.civilian, as: "witnessCivilians" },
        "createdAt",
        ASCENDING
      ],
      [
        { model: models.case_officer, as: "witnessOfficers" },
        "createdAt",
        ASCENDING
      ]
    ],
    include: [
      {
        model: models.referral_letter,
        as: "referralLetter"
      },
      {
        model: models.case_classification,
        as: "caseClassifications",
        include: [
          {
            model: models.classification,
            as: "classification"
          }
        ]
      },
      {
        model: models.address,
        as: "incidentLocation"
      },
      {
        model: models.civilian,
        as: "complainantCivilians",
        include: [
          { model: models.address },
          { model: models.race_ethnicity, as: "raceEthnicity" },
          { model: models.gender_identity, as: "genderIdentity" }
        ]
      },
      {
        model: models.civilian,
        as: "witnessCivilians"
      },
      {
        model: models.case_officer,
        as: "complainantOfficers"
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
    ],
    transaction
  };
  const caseData = await models.cases.findByPk(caseId, queryOptions);

  const auditDetails = getQueryAuditAccessDetails(
    queryOptions,
    models.cases.name
  );

  return { caseData: caseData, auditDetails: auditDetails };
};

const referralLetterBodyPath = `${process.env.REACT_APP_INSTANCE_FILES_DIR}/letterBody.tpl`;

export const generateReferralLetterBodyAndAuditDetails = async (
  caseId,
  transaction
) => {
  let caseData;

  const caseDataAndAuditDetails =
    await getReferralLetterCaseDataAndAuditDetails(caseId, transaction);

  caseData = caseDataAndAuditDetails.caseData.toJSON();
  caseData.accusedOfficers.sort((officerA, officerB) => {
    return officerA.createdAt > officerB.createdAt;
  });

  const rawTemplate = fs.readFileSync(referralLetterBodyPath);
  const compiledTemplate = Handlebars.compile(rawTemplate.toString());
  return {
    referralLetterBody: compiledTemplate(caseData),
    auditDetails: caseDataAndAuditDetails.auditDetails
  };
};
