import models from "../../../models";
import fs from "fs";
import Handlebars from "handlebars";

const getCaseData = async (caseId, transaction) => {
  return await models.cases.findById(caseId, {
    attributes: [
      ["id", "caseId"],
      "incidentDate",
      "incidentTime",
      "narrativeSummary",
      "narrativeDetails",
      "firstContactDate",
      "complaintType"
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
        include: [{ model: models.address }]
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

async function generateLetterBody(caseId, transaction) {
  const caseData = (await getCaseData(caseId, transaction)).toJSON();
  caseData.accusedOfficers.sort((officerA, officerB) => {
    return officerA.createdAt > officerB.createdAt;
  });

  const rawTemplate = fs.readFileSync(
    "src/server/handlers/cases/referralLetters/getLetterPreview/letterBody.tpl"
  );
  const compiledTemplate = Handlebars.compile(rawTemplate.toString());
  return compiledTemplate(caseData);
}

export default generateLetterBody;
