import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import models from "../../../policeDataManager/models";
import request from "supertest";
import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import app from "../../../server";
import {
  CASE_STATUS,
  COMPLAINANT,
  DATE_RANGE_TYPE,
  ISO_DATE
} from "../../../../sharedUtilities/constants";
import { updateCaseStatus } from "./queryHelperFunctions";
import Civilian from "../../../../sharedTestHelpers/civilian";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import moment from "moment";
import { seedStandardCaseStatuses } from "../../../testHelpers/testSeeding";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

jest.mock(
  "../../../getFeaturesAsync",
  () => callback =>
    callback([
      {
        id: "FEATURE",
        name: "FEATURE",
        description: "This is a feature",
        enabled: true
      }
    ])
);

describe("executeQuery", () => {
  let complainantOfficerPO,
    civilianCC,
    civilianAC,
    caseAttributes,
    complainantCaseCC,
    complainantCaseAC,
    complainantCasePO,
    statuses;

  const token = buildTokenWithPermissions("", "tuser");

  const expectedData = PERSON_TYPE.PERSON_IN_CUSTODY
    ? {
        [PERSON_TYPE.PERSON_IN_CUSTODY.abbreviation]: 2, // TODO alter this as more person types emerge
        AC: 1
      }
    : {
        [PERSON_TYPE.CIVILIAN.abbreviation]: 1,
        [PERSON_TYPE.KNOWN_OFFICER.abbreviation]: 1,
        [PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation]: 0,
        AC: 1
      };

  const getResponsePromise = request(app)
    .get("/api/public-data")
    .set("Content-Header", "application/json")
    .set("Authorization", `Bearer ${token}`)
    .query({ queryType: "countComplaintsByComplainantType" });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    statuses = await seedStandardCaseStatuses();

    civilianCC = new Civilian.Builder().defaultCivilian().withId(2);

    civilianAC = new Civilian.Builder()
      .defaultCivilian()
      .withIsAnonymous(true)
      .withId(3);

    complainantOfficerPO = (await createCaseOfficer("Officer")) // TODO replace with inmate?
      .withId(4);

    const todaysDate = moment().format(ISO_DATE);

    caseAttributes = createCaseAttributesBasedOnComplainants(
      [civilianCC],
      [],
      todaysDate,
      22
    );
    complainantCaseCC = await createCase(caseAttributes);
    await updateCaseStatus(
      complainantCaseCC,
      CASE_STATUS.FORWARDED_TO_AGENCY,
      statuses
    );

    caseAttributes = createCaseAttributesBasedOnComplainants(
      [civilianAC],
      [],
      todaysDate,
      33
    );
    complainantCaseAC = await createCase(caseAttributes);
    await updateCaseStatus(
      complainantCaseAC,
      CASE_STATUS.FORWARDED_TO_AGENCY,
      statuses
    );

    caseAttributes = createCaseAttributesBasedOnComplainants(
      [],
      [complainantOfficerPO],
      todaysDate,
      44
    );
    complainantCasePO = await createCase(caseAttributes);
    await updateCaseStatus(complainantCasePO, CASE_STATUS.CLOSED, statuses);
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

  test("should return only complaints within the past 12 months", async () => {
    const oldCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(moment().subtract(364, "days").format(ISO_DATE))
        .withComplainantCivilians([civilianCC])
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );
    await updateCaseStatus(oldCase, CASE_STATUS.FORWARDED_TO_AGENCY, statuses);

    const getComplaintsPast12Months = request(app)
      .get("/api/public-data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({
        queryType: "countComplaintsByComplainantType",
        minDate: moment().subtract(12, "months").format(ISO_DATE)
      });

    const expectedDataPast12Months = { ...expectedData };
    if (PERSON_TYPE.PERSON_IN_CUSTODY) {
      expectedDataPast12Months[PERSON_TYPE.PERSON_IN_CUSTODY.abbreviation]++;
    } else {
      expectedDataPast12Months[PERSON_TYPE.CIVILIAN.abbreviation]++;
    }

    await getComplaintsPast12Months.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(expectedDataPast12Months);
    });
  });
  test("should return only complaints within the current year to date", async () => {
    const getComplaintsYTD = request(app)
      .get("/api/public-data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({
        queryType: "countComplaintsByComplainantType",
        dateRangeType: DATE_RANGE_TYPE.YTD
      });

    const oldCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2019-12-31")
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );
    await updateCaseStatus(oldCase, CASE_STATUS.FORWARDED_TO_AGENCY, statuses);

    await getComplaintsYTD.then(response => {
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

    await updateCaseStatus(activeCase, CASE_STATUS.ACTIVE, statuses);

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
      CASE_STATUS.LETTER_IN_PROGRESS,
      statuses
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

    await updateCaseStatus(
      readyForReviewCase,
      CASE_STATUS.READY_FOR_REVIEW,
      statuses
    );

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
    await updateCaseStatus(
      archivedCase,
      CASE_STATUS.FORWARDED_TO_AGENCY,
      statuses
    );

    await archivedCase.destroy({ auditUser: "someone" });

    await getResponsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual(expectedData);
    });
  });
});
