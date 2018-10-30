import asyncMiddleware from "../../../asyncMiddleware";
import fs from "fs";
import Handlebars from "handlebars";
import models from "../../../../models";
require("../../../../handlebarHelpers");

const getLetterPreview = asyncMiddleware(async (request, response, next) => {
  const rawTemplate = fs.readFileSync(
    "src/server/handlers/cases/referralLetters/getLetterPreview/letter.tpl"
  );
  const compiledTemplate = Handlebars.compile(rawTemplate.toString());

  const caseData = (await models.cases.findById(request.params.caseId, {
    attributes: [
      ["id", "caseId"],
      "incidentDate",
      "incidentTime",
      "narrativeSummary",
      "narrativeDetails"
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
                  { model: models.recommended_action, as: "recommendedAction" }
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
  })).toJSON();

  const html = compiledTemplate(caseData);
  response.send(html);
});

export default getLetterPreview;
