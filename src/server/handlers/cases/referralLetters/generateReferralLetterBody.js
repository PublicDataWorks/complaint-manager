import models from "../../../models";
import fs from "fs";
import Handlebars from "handlebars";
import { addToExistingAuditDetails } from "../../getQueryAuditAccessDetails";

const getReferralLetterCaseData = async (caseId, transaction, auditDetails) => {
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
    order: [
      [
        { model: models.case_officer, as: "complainantOfficers" },
        "createdAt",
        "ASC"
      ],
      [
        { model: models.civilian, as: "complainantCivilians" },
        "createdAt",
        "ASC"
      ],
      [{ model: models.civilian, as: "witnessCivilians" }, "createdAt", "ASC"],
      [
        { model: models.case_officer, as: "witnessOfficers" },
        "createdAt",
        "ASC"
      ]
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

  addToExistingAuditDetails(auditDetails, queryOptions, models.cases.name);

  return caseData;
};

const referralLetterBodyPath =
  "src/server/handlers/cases/referralLetters/getReferralLetterPreview/letterBody.tpl";

async function generateReferralLetterBody(
  caseId,
  transaction,
  auditDetails = null
) {
  let caseData;
  const caseDataInstance = await getReferralLetterCaseData(
    caseId,
    transaction,
    auditDetails
  );
  caseData = caseDataInstance.toJSON();
  caseData.accusedOfficers.sort((officerA, officerB) => {
    return officerA.createdAt > officerB.createdAt;
  });

  const rawTemplate = fs.readFileSync(referralLetterBodyPath);
  const compiledTemplate = Handlebars.compile(rawTemplate.toString());
  return compiledTemplate(caseData);
}

export default generateReferralLetterBody;
