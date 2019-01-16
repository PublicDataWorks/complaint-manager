import models from "../../../server/models";
import winston from "winston";
const NEW_CASE_NUMBER_MAPPINGS = require("./renumberCaseReferenceNumbersCaseMappings")[
  process.env.NODE_ENV
];
const MIGRATION_AUDIT_USER = "System Migration: 002";

const renumberCaseReferenceNumbers = async revert => {
  await models.sequelize.transaction(async transaction => {
    for (let caseNumberMapping of orderedCaseNumberMappings(revert)) {
      const matchingCases = await findCaseToUpdate(caseNumberMapping, revert);
      validateFoundExactlyOneMatch(matchingCases, caseNumberMapping);
      const caseToUpdate = matchingCases[0];
      try {
        const result = await updateCase(
          caseToUpdate,
          caseNumberMapping,
          revert,
          transaction
        );
        logResultMessage(result, caseNumberMapping);
      } catch (error) {
        winston.error(
          "Error reassigning case reference number. Aborting task.",
          error
        );
        throw error;
      }
    }
  });
};

const updateCase = async (
  caseToUpdate,
  caseNumberMapping,
  revert,
  transaction
) => {
  const caseNumberToUse = revert
    ? caseNumberMapping.number.old
    : caseNumberMapping.number.new;
  return await caseToUpdate.update(
    { caseNumber: caseNumberToUse },
    { validate: false, transaction, auditUser: MIGRATION_AUDIT_USER }
  );
};

const orderedCaseNumberMappings = revert => {
  if (revert) {
    return NEW_CASE_NUMBER_MAPPINGS.reverse();
  } else {
    return NEW_CASE_NUMBER_MAPPINGS;
  }
};

const findCaseToUpdate = async (caseNumberMapping, revert) => {
  const caseNumberForLookup = revert
    ? caseNumberMapping.number.new
    : caseNumberMapping.number.old;
  return await models.cases.findAll({
    where: {
      year: caseNumberMapping.year,
      caseNumber: caseNumberForLookup
    }
  });
};

const validateFoundExactlyOneMatch = (matchingCases, caseNumberMapping) => {
  if (!matchingCases || matchingCases.length !== 1) {
    throw `Case not found with year ${caseNumberMapping.year} and number ${
      caseNumberMapping.number.old
    }. Aborting task.`;
  }
};

const logResultMessage = (result, caseNumberMapping) => {
  winston.info(
    `Case Number Change: Case with id ${result.id} updated case number from ${
      caseNumberMapping.number.old
    } to ${result.caseNumber} with year ${result.year}.`
  );
};

export default renumberCaseReferenceNumbers;
