import Case from "../../client/testUtilities/case";
import CaseOfficer from "../../client/testUtilities/caseOfficer";
import Officer from "../../client/testUtilities/Officer";
import models from "../models";
import { DATA_CREATED } from "../../sharedUtilities/constants";

describe("dataChangeAudithooks caseofficer", () => {
  afterEach(async () => {
    await models.cases.destroy({
      truncate: true,
      cascade: true,
      auditUser: "someone",
      force: true
    });
    await models.data_change_audit.truncate();
  });

  test("should audit caseofficer creation", async () => {
    const anOfficer = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined)
      .build();
    const anAccusedOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerAttributes(anOfficer)
      .withNoSupervisor()
      .build();
    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined)
      .withAccusedOfficers([anAccusedOfficer])
      .build();

    const createdCase = await models.cases.create(caseToCreate, {
      include: [
        {
          model: models.case_officer,
          as: "accusedOfficers",
          auditUser: "someone"
        }
      ],
      auditUser: "someone"
    });

    const audit = await models.data_change_audit.find({
      where: { modelName: "case_officer", action: DATA_CREATED }
    });

    expect(audit.user).toEqual("someone");
    expect(audit.modelId).toEqual(createdCase.accusedOfficers[0].id);
    expect(audit.caseId).toEqual(createdCase.id);
  });
});
