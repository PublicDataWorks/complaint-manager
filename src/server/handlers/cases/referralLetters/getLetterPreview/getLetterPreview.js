import asyncMiddleware from "../../../asyncMiddleware";
import fs from "fs";
import Handlebars from "handlebars";
import models from "../../../../models";
import checkForValidStatus from "../checkForValidStatus";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../../sharedUtilities/constants";
import auditDataAccess from "../../../auditDataAccess";
import getCaseWithAllAssociations from "../../../getCaseWithAllAssociations";

require("../../../../handlebarHelpers");

const getLetterPreview = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.caseId;
  await checkForValidStatus(caseId);

  await models.sequelize.transaction(async transaction => {
    await auditDataAccess(
      request.nickname,
      caseId,
      AUDIT_SUBJECT.REFERRAL_LETTER,
      transaction,
      AUDIT_ACTION.DATA_ACCESSED
    );

    const referralLetter = await models.referral_letter.findOne(
      { where: { caseId } },
      transaction
    );

    let letterAddresses = {
      recipient: referralLetter.recipient,
      sender: referralLetter.sender,
      transcribedBy: referralLetter.transcribedBy
    };

    let html;
    const edited = referralLetter.editedLetterHtml != null;
    if (edited) {
      html = referralLetter.editedLetterHtml;
    } else {
      html = await generateReferralLetterFromCaseData(caseId, transaction);
    }

    let editHistory = { edited: edited };
    if (edited) {
      editHistory.lastEdited = referralLetter.updatedAt;
    }
    const caseDetails = await getCaseWithAllAssociations(caseId, transaction);
    response.send({
      letterHtml: html,
      addresses: letterAddresses,
      editHistory: editHistory,
      caseDetails: caseDetails
    });
  });
});

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

async function generateReferralLetterFromCaseData(caseId, transaction) {
  const caseData = (await getCaseData(caseId, transaction)).toJSON();
  caseData.accusedOfficers.sort((officerA, officerB) => {
    return officerA.createdAt > officerB.createdAt;
  });

  const rawTemplate = fs.readFileSync(
    "src/server/handlers/cases/referralLetters/getLetterPreview/letter.tpl"
  );
  const compiledTemplate = Handlebars.compile(rawTemplate.toString());
  return compiledTemplate(caseData);
}

export default getLetterPreview;
