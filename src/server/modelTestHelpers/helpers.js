import models from "../models/index";

export const createCaseWithoutCivilian = async () => {
  const initialCase = await models.cases.create(
    {
      status: "Initial",
      createdBy: "test_user",
      assignedTo: "test_user"
    },
    { auditUser: "someone" }
  );

  return initialCase;
};

export const createCaseWithCivilian = async () => {
  const initialCase = await models.cases.create(
    {
      status: "Initial",
      createdBy: "test_user",
      assignedTo: "test_user",
      complainantCivilians: [
        { firstName: "Ever", lastName: "Greatest", phoneNumber: "1234567890" }
      ]
    },
    {
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "someone"
        }
      ],
      auditUser: "someone"
    }
  );

  return initialCase;
};