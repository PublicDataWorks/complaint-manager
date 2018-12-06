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
  return `system migration ${migrationDirection}: ${path.basename(__filename)}`;
};

module.exports = {
  up: async () => {
    await models.sequelize.transaction(async transaction => {
      const cases = await getCasesToUpdate(transaction);

      for await (let oneCase of cases) {
        await migrateCase(oneCase, transaction);
      }
    });
  },

  down: async () => {
    const audits = await models.data_change_audit.findAll({
      where: { user: `${getMigrationUser("up")}` }
    });

    await destroyCreatedRecords(audits);
  }
};

const destroyCreatedRecords = async audits => {
  for await (let audit of audits) {
    const transformedModelName = transformModelName(audit.modelName);
    if (audit.action === AUDIT_ACTION.DATA_CREATED) {
      await models[transformedModelName].destroy({
        where: {
          id: audit.modelId
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

async function getCasesToUpdate(transaction) {
  return await models.cases.findAll({
    where: {
      status: [
        CASE_STATUS.LETTER_IN_PROGRESS,
        CASE_STATUS.READY_FOR_REVIEW,
        CASE_STATUS.FORWARDED_TO_AGENCY,
        CASE_STATUS.CLOSED
      ],
      "$referralLetter.id$": null
    },
    attributes: ["id", "status"],
    include: [
      {
        model: models.case_officer,
        as: "accusedOfficers",
        attributes: ["id"],
        include: [
          {
            model: models.letter_officer,
            as: "letterOfficer",
            attributes: ["caseOfficerId"]
          }
        ]
      },
      {
        model: models.referral_letter,
        as: "referralLetter"
      }
    ],
    transaction
  });
}

const migrateCase = async (oneCase, transaction) => {
  const jsonCase = oneCase.toJSON();

  await createReferralLetter(jsonCase, transaction);

  for await (let accusedOfficer of jsonCase.accusedOfficers) {
    await createLetterOfficerIfNull(accusedOfficer, transaction);
  }
};

const createLetterOfficerIfNull = async (accusedOfficer, transaction) => {
  if (accusedOfficer.letterOfficer) {
    return;
  }
  const letterOfficerAttributes = {
    caseOfficerId: accusedOfficer.id
  };

  await models.letter_officer.create(
    letterOfficerAttributes,
    {
      auditUser: `${getMigrationUser("up")}`
    },
    transaction
  );
};

const createReferralLetter = async (jsonCase, transaction) => {
  const referralLetterAttributes = {
    caseId: jsonCase.id,
    sender: SENDER,
    recipient: RECIPIENT
  };

  await models.referral_letter.create(referralLetterAttributes, {
    auditUser: `${getMigrationUser("up")}`,
    transaction
  });
};
