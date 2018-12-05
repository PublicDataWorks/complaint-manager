import constructFilename from "../../handlers/cases/referralLetters/constructFilename";
import {
  CIVILIAN_INITIATED,
  REFERRAL_LETTER_VERSION
} from "../../../sharedUtilities/constants";
import {
  RECIPIENT,
  SENDER
} from "../../handlers/cases/referralLetters/letterDefaults";

const models = require("../../models");
const {
  AUDIT_ACTION,
  CASE_STATUS
} = require("../../../sharedUtilities/constants");
const path = require("path");

const getMigrationUser = migrationDirection => {
  return `migrate ${migrationDirection}: ${path.basename(__filename)}`;
};

module.exports = {
  up: async () => {
    const cases = await getCases();

    for (let i = 0; i < cases.length; i++) {
      await migrateCase(cases[i]);
    }
  },

  down: async () => {
    const audits = await models.data_change_audit.findAll({
      where: { user: `${getMigrationUser("up")}` }
    });

    await destroyCreatedRecords(audits);
  }
};

const destroyCreatedRecords = async audits => {
  for (let i = 0; i < audits.length; i++) {
    const transformedModelName = transformModelName(audits[i].modelName);
    if (audits[i].action === AUDIT_ACTION.DATA_CREATED) {
      await models[transformedModelName].destroy({
        where: {
          id: audits[i].modelId
        },
        auditUser: getMigrationUser("down")
      });
    }
  }
};

const transformModelName = modelName => {
  let transformedModelName = modelName.toLowerCase();
  return transformedModelName.replace(" ", "_");
};

async function getCases() {
  return await models.cases.findAll({
    attributes: ["id", "status", "firstContactDate", "complaintType"],
    include: [
      {
        model: models.case_officer,
        as: "accusedOfficers",
        auditUser: `${getMigrationUser("up")}`,
        attributes: ["id"],
        include: [
          {
            model: models.letter_officer,
            as: "letterOfficer",
            auditUser: `${getMigrationUser("up")}`,
            attributes: ["caseOfficerId"]
          }
        ]
      },
      {
        model: models.referral_letter,
        as: "referralLetter",
        auditUser: `${getMigrationUser("up")}`
      },
      {
        model: models.case_officer,
        as: "complainantOfficers",
        auditUser: `${getMigrationUser("up")}`,
        attributes: ["lastName"]
      },
      {
        model: models.civilian,
        as: "complainantCivilians",
        auditUser: `${getMigrationUser("up")}`,
        attributes: ["lastName"]
      }
    ]
  });
}

const migrateCase = async oneCase => {
  const jsonCase = oneCase.toJSON();

  if (
    [
      CASE_STATUS.INITIAL,
      CASE_STATUS.ACTIVE,
      CASE_STATUS.LETTER_IN_PROGRESS
    ].includes(jsonCase.status)
  ) {
    return;
  }
  await createReferralLetterIfNull(jsonCase);
  for (let i = 0; i < jsonCase.accusedOfficers.length; i++) {
    await createLetterOfficerIfNull(jsonCase.accusedOfficers[i]);
  }
};

const createLetterOfficerIfNull = async accusedOfficer => {
  if (accusedOfficer.letterOfficer) {
    return;
  }
  const letterOfficerAttributes = {
    caseOfficerId: accusedOfficer.id
  };

  const createdLetterOfficer = await models.letter_officer.create(
    letterOfficerAttributes,
    {
      auditUser: `${getMigrationUser("up")}`
    }
  );
};

const createReferralLetterIfNull = async jsonCase => {
  if (jsonCase.referralLetter) {
    return;
  }
  const referralLetterAttributes = {
    caseId: jsonCase.id,
    finalPdfFilename: constructFinalPdfFilename(jsonCase),
    sender: SENDER,
    recipient: RECIPIENT
  };

  await models.referral_letter.create(referralLetterAttributes, {
    auditUser: `${getMigrationUser("up")}`
  });
};

const constructFinalPdfFilename = jsonCase => {
  if (
    ![CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED].includes(
      jsonCase.status
    )
  ) {
    return null;
  }

  return constructFilename(
    jsonCase.id,
    jsonCase.caseNumber,
    jsonCase.firstContactDate,
    getFirstComplainantLastName(jsonCase),
    REFERRAL_LETTER_VERSION.FINAL
  );
};

const getFirstComplainantLastName = jsonCase => {
  const firstComplainant =
    jsonCase.complaintType === CIVILIAN_INITIATED
      ? jsonCase.complainantCivilians[0]
      : jsonCase.complainantOfficers[0];

  return firstComplainant ? firstComplainant.lastName : "";
};
