import models from "../../../models";
import fs from "fs";
import Handlebars from "handlebars";

const getCaseData = async (caseId, transaction) => {
  return await models.cases.findByPk(caseId, {
    attributes: [
      ["id", "caseId"],
      "incidentDate",
      "incidentTime",
      "narrativeSummary",
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
  });
};

const getComplainantLetterCaseData = async (caseId, transaction) => {
  return await models.cases.findByPk(caseId, {
    attributes: [
      ["id", "caseId"],
      "firstContactDate",
      "complaintType",
      "year",
      "caseNumber"
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
      {
        model: models.civilian,
        as: "complainantCivilians",
        include: [
          { model: models.address },
          { model: models.race_ethnicity, as: "raceEthnicity" }
        ]
      },
      {
        model: models.case_officer,
        as: "complainantOfficers"
      }
    ],
    transaction
  });
};

const defaultReferralLetterBodyPath =
  "src/server/handlers/cases/referralLetters/getReferralLetterPreview/letterBody.tpl";

async function generateReferralLetterBody(
  caseId,
  transaction,
  letterBodyPath = defaultReferralLetterBodyPath
) {
  let caseData;
  if (letterBodyPath === defaultReferralLetterBodyPath) {
    caseData = (await getCaseData(caseId, transaction)).toJSON();
    caseData.accusedOfficers.sort((officerA, officerB) => {
      return officerA.createdAt > officerB.createdAt;
    });
  } else {
    caseData = (await getComplainantLetterCaseData(
      caseId,
      transaction
    )).toJSON();
  }

  const rawTemplate = fs.readFileSync(letterBodyPath);
  const compiledTemplate = Handlebars.compile(rawTemplate.toString());
  return compiledTemplate(caseData);
}

export default generateReferralLetterBody;
