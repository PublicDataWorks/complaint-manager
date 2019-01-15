const {
  AUDIT_SUBJECT,
  RANK_INITIATED
} = require("../../../sharedUtilities/constants");
const auditDataAccess = require("../auditDataAccess");

const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models/index");
const Boom = require("boom");
const MAX_RETRIES = 3;
const FIRST_TRY = 1;

const createCase = asyncMiddleware(async (request, response, next) => {
  let newCase = {};
  if (request.body.case.complaintType === RANK_INITIATED) {
    newCase = await createCaseWithoutCivilian(request);
  } else {
    validateCivilianName(request.body.civilian);
    newCase = await createCaseWithCivilian(request);
  }

  response.status(201).send(newCase);
});

const validateCivilianName = civilian => {
  const first = civilian.firstName;
  const last = civilian.lastName;

  if (invalidName(first) || invalidName(last)) {
    throw Boom.badRequest("Invalid civilian name");
  }
};

const invalidName = input => {
  return !input || input.length === 0 || input.length > 25;
};

const createCaseWithoutCivilian = async request => {
  return await createCaseWithRetry(
    request.body.case,
    [],
    request.nickname,
    FIRST_TRY
  );
};

const createCaseWithCivilian = async request => {
  const newCaseAttributes = {
    ...request.body.case,
    complainantCivilians: [request.body.civilian]
  };
  const includeOptions = [
    {
      model: models.civilian,
      as: "complainantCivilians",
      auditUser: request.nickname
    }
  ];
  return await createCaseWithRetry(
    newCaseAttributes,
    includeOptions,
    request.nickname,
    FIRST_TRY
  );
};

const createCaseWithRetry = async (
  newCaseAttributes,
  includeOptions,
  nickname,
  retryNumber
) => {
  const caseAttributes = addMetadataToCaseAttributes(
    newCaseAttributes,
    nickname
  );
  try {
    return await attemptCreateCase(caseAttributes, includeOptions, nickname);
  } catch (error) {
    if (failedToCreateUniqueCaseReferenceNumber(error)) {
      if (retryNumber === MAX_RETRIES) {
        throw Boom.internal(
          `Could not obtain unique case reference number after ${MAX_RETRIES} tries`
        );
      }
      await createCaseWithRetry(
        newCaseAttributes,
        includeOptions,
        nickname,
        retryNumber + 1
      );
    } else {
      throw error;
    }
  }
};

const failedToCreateUniqueCaseReferenceNumber = error => {
  return (
    error.name === "SequelizeUniqueConstraintError" &&
    Object.keys(error.fields).includes("case_number")
  );
};

const attemptCreateCase = async (caseAttributes, includeOptions, nickname) => {
  let createdCase;
  await models.sequelize.transaction(async transaction => {
    createdCase = await models.cases.create(caseAttributes, {
      include: includeOptions,
      auditUser: nickname,
      transaction
    });
    await auditDataAccess(
      nickname,
      createdCase.id,
      AUDIT_SUBJECT.CASE_DETAILS,
      transaction
    );
  });
  return createdCase;
};

const addMetadataToCaseAttributes = (caseAttributes, nickname) => {
  const metadataAttributes = {
    createdBy: nickname,
    assignedTo: nickname
  };
  return { ...caseAttributes, ...metadataAttributes };
};

module.exports = createCase;
