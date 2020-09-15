import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import models from "../../../complaintManager/models";
import request from "supertest";
import Case from "../../../../client/complaintManager/testUtilities/case";
import app from "../../../server";
import {
  CASE_STATUS,
  COMPLAINANT,
  EMPLOYEE_TYPE
} from "../../../../sharedUtilities/constants";
import { updateCaseStatus } from "./queryHelperFunctions";
import Civilian from "../../../../sharedTestHelpers/civilian";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";

describe("executeQuery", () => {
  let complainantOfficerPO;
  let civilianCC, civilianAC;

  let caseAttributes;

  let complainantCaseCC, complainantCaseAC, complainantCasePO;

  const token = buildTokenWithPermissions("", "tuser");

  const expectedData = {
    CC: 1,
    PO: 1,
    CN: 0,
    AC: 1
  };

  const getResponsePromise = request(app)
    .get("/api/data")
    .set("Content-Header", "application/json")
    .set("Authorization", `Bearer ${token}`)
    .query({ queryType: "countComplaintsByComplainantType" });

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    civilianCC = new Civilian.Builder().defaultCivilian().withId(2);

    civilianAC = new Civilian.Builder()
      .defaultCivilian()
      .withIsAnonymous(true)
      .withId(3);

    complainantOfficerPO = (
      await createCaseOfficer(EMPLOYEE_TYPE.OFFICER)
    ).withId(4);

    caseAttributes = createCaseAttributesBasedOnComplainants(
      [civilianCC],
      [],
      "2020-02-02",
      22
    );
    complainantCaseCC = await createCase(caseAttributes);
    await updateCaseStatus(complainantCaseCC, CASE_STATUS.FORWARDED_TO_AGENCY);

    caseAttributes = createCaseAttributesBasedOnComplainants(
      [civilianAC],
      [],
      "2020-02-02",
      33
    );
    complainantCaseAC = await createCase(caseAttributes);
    await updateCaseStatus(complainantCaseAC, CASE_STATUS.FORWARDED_TO_AGENCY);

    caseAttributes = createCaseAttributesBasedOnComplainants(
      [],
      [complainantOfficerPO],
      "2020-02-02",
      44
    );
    complainantCasePO = await createCase(caseAttributes);
    await updateCaseStatus(complainantCasePO, CASE_STATUS.CLOSED);
  });

  const createCaseAttributesBasedOnComplainants = (
    complainantCivilians,
    complainantOfficers,
    firstContactDate,
    id
  ) => {
    return new Case.Builder()
      .defaultCase()
      .withComplainantCivilians(complainantCivilians)
      .withComplainantOfficers(complainantOfficers)
      .withFirstContactDate(firstContactDate)
      .withId(id);
  };

  const createCaseOfficer = async caseEmployeeType => {
    return new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(undefined)
      .withRoleOnCase(COMPLAINANT)
      .withCaseEmployeeType(caseEmployeeType);
  };

  const createCase = caseAttributes => {
    return models.cases.create(caseAttributes, {
      auditUser: "someone",
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "someone"
        },
        {
          model: models.case_officer,
          as: "complainantOfficers",
          auditUser: "someone"
        }
      ]
    });
  };

  test("should return complainant types for ytd complaints forwarded to agency or closed", async () => {
    await getResponsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(expectedData);
    });
  });

  test("should return only complaints within the current year to date", async () => {
    const oldCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2019-12-31")
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );
    await updateCaseStatus(oldCase, CASE_STATUS.FORWARDED_TO_AGENCY);

    await getResponsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(expectedData);
    });
  });

  test("should return only complaints where status is forwarded to agency or closed", async () => {
    await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2020-02-21")
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    const activeCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2020-02-21")
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(activeCase, CASE_STATUS.ACTIVE);

    const letterInProgressCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2020-02-21")
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(
      letterInProgressCase,
      CASE_STATUS.LETTER_IN_PROGRESS
    );

    const readyForReviewCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2020-02-21")
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(readyForReviewCase, CASE_STATUS.READY_FOR_REVIEW);

    await getResponsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(expectedData);
    });
  });

  test("should return only complaints that are NOT archived", async () => {
    const archivedCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2020-02-21")
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );
    await updateCaseStatus(archivedCase, CASE_STATUS.FORWARDED_TO_AGENCY);

    await archivedCase.destroy({ auditUser: "someone" });

    await getResponsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(expectedData);
    });
  });
});
