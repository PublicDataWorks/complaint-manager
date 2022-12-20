import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import request from "supertest";
import app from "../../../server";
import Civilian from "../../../../sharedTestHelpers/civilian";
import {
  CASE_STATUS,
  COMPLAINANT,
  ISO_DATE,
  QUERY_TYPES
} from "../../../../sharedUtilities/constants";
import { updateCaseStatus } from "./queryHelperFunctions";
import Case from "../../../../sharedTestHelpers/case";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import models from "../../../policeDataManager/models";
import {
  getDateRange,
  getAllComplaints
} from "./countMonthlyComplaintsByComplainantType";
import moment from "moment";
import { seedStandardCaseStatuses } from "../../../testHelpers/testSeeding";

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

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

describe("executeQuery", () => {
  afterAll(async () => {
    await models.sequelize.close();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  let complainantOfficerPO,
    civilianCC,
    civilianAC,
    caseAttributes,
    complainantCaseCC,
    complainantCaseAC,
    complainantCasePO,
    statuses;

  const token = buildTokenWithPermissions("", "tuser");

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

  const getResponsePromise = request(app)
    .get("/api/public-data")
    .set("Content-Header", "application/json")
    .set("Authorization", `Bearer ${token}`)
    .query({
      queryType: QUERY_TYPES.COUNT_MONTHLY_COMPLAINTS_BY_COMPLAINANT_TYPE
    });

  beforeEach(async () => {
    await cleanupDatabase();
    statuses = await seedStandardCaseStatuses();

    civilianCC = new Civilian.Builder().defaultCivilian().withId(2);

    civilianAC = new Civilian.Builder()
      .defaultCivilian()
      .withIsAnonymous(true)
      .withId(3);

    complainantOfficerPO = (
      await createCaseOfficer(PERSON_TYPE.KNOWN_OFFICER.employeeDescription)
    ).withId(4);
  });

  describe("helper functions", () => {
    beforeEach(async () => {
      caseAttributes = createCaseAttributesBasedOnComplainants(
        [civilianCC],
        [],
        "2020-07-02",
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
        "2020-02-02",
        33
      );
      complainantCaseAC = await createCase(caseAttributes);
      await updateCaseStatus(
        complainantCaseAC,
        CASE_STATUS.LETTER_IN_PROGRESS,
        statuses
      );

      caseAttributes = createCaseAttributesBasedOnComplainants(
        [],
        [complainantOfficerPO],
        "2020-02-02",
        44
      );
      complainantCasePO = await createCase(caseAttributes);
      await updateCaseStatus(complainantCasePO, CASE_STATUS.CLOSED, statuses);
    });

    test("getDateRange should return list of date, count objects for given date range", () => {
      const expectedCounts = [
        { date: "Mar 19", count: 0 },
        { date: "Apr 19", count: 0 },
        { date: "May 19", count: 0 },
        { date: "Jun 19", count: 0 },
        { date: "Jul 19", count: 0 },
        { date: "Aug 19", count: 0 },
        { date: "Sep 19", count: 0 },
        { date: "Oct 19", count: 0 },
        { date: "Nov 19", count: 0 },
        { date: "Dec 19", count: 0 },
        { date: "Jan 20", count: 0 },
        { date: "Feb 20", count: 0 },
        { date: "Mar 20", count: 0 }
      ];

      const expectedDateToIndex = {
        "2019-03": 0,
        "2019-04": 1,
        "2019-05": 2,
        "2019-06": 3,
        "2019-07": 4,
        "2019-08": 5,
        "2019-09": 6,
        "2019-10": 7,
        "2019-11": 8,
        "2019-12": 9,
        "2020-01": 10,
        "2020-02": 11,
        "2020-03": 12
      };

      const results = getDateRange({
        minDate: "2019-03-01",
        maxDate: "2020-03-01"
      });

      expect(results.counts).toEqual(expectedCounts);
      expect(results.dateToIndex).toEqual(expectedDateToIndex);
    });

    test("getDateRange should return list of date, count objects for past 12 months", () => {
      const expectedDateToIndex = {};

      let date = moment().subtract(12, "months");
      let currentDate = moment();
      for (let i = 0; date <= currentDate; i++, date = date.add(1, "months")) {
        expectedDateToIndex[date.format("YYYY-MM")] = i;
      }

      const results = getDateRange();

      expect(results.dateToIndex).toEqual(expectedDateToIndex);
    });

    test("should return all complaints where first contact date is within past 12 months, not archived, and forwarded to agency or closed", async () => {
      const date = "2020-07-20";
      const minDate = moment(date).subtract(1, "years");
      const maxDate = moment(date).subtract(1, "months");

      const complaints = await getAllComplaints({ minDate, maxDate }, "tuser");

      expect(complaints.length).toEqual(1);
      expect(complaints[0].dataValues.id).toEqual(complainantCasePO.id);
    });
  });

  describe("execute query", () => {
    beforeEach(async () => {
      caseAttributes = createCaseAttributesBasedOnComplainants(
        [],
        [],
        moment().subtract(3, "month"),
        5678
      );
      complainantCaseCC = await createCase(caseAttributes);
      await updateCaseStatus(
        complainantCaseCC,
        CASE_STATUS.FORWARDED_TO_AGENCY,
        statuses
      );

      caseAttributes = createCaseAttributesBasedOnComplainants(
        [],
        [],
        moment().subtract(3, "month"),
        565687
      );
      complainantCaseCC = await createCase(caseAttributes);
      await updateCaseStatus(
        complainantCaseCC,
        CASE_STATUS.FORWARDED_TO_AGENCY,
        statuses
      );

      caseAttributes = createCaseAttributesBasedOnComplainants(
        [civilianCC],
        [],
        moment().subtract(1, "month"),
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
        moment().subtract(13, "month"),
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
        moment().subtract(4, "month"),
        44
      );
      complainantCasePO = await createCase(caseAttributes);
      await updateCaseStatus(complainantCasePO, CASE_STATUS.CLOSED, statuses);
    });

    test("should return complainant types for past 12 months", async () => {
      await getResponsePromise.then(response => {
        expect(response.statusCode).toEqual(200);
        expect(
          response.body[PERSON_TYPE.CIVILIAN.abbreviation][9]["count"]
        ).toEqual(2);
        expect(
          response.body[PERSON_TYPE.CIVILIAN.abbreviation][11]["count"]
        ).toEqual(1);
        expect(
          response.body[PERSON_TYPE.KNOWN_OFFICER.abbreviation][8]["count"]
        ).toEqual(1);
        expect(
          response.body[PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation][3]["count"]
        ).toEqual(0);

        const numOfCC = response.body[PERSON_TYPE.CIVILIAN.abbreviation].filter(
          month => month["count"] === 0
        ).length;
        expect(numOfCC).toEqual(10);

        const numOfPO = response.body[
          PERSON_TYPE.KNOWN_OFFICER.abbreviation
        ].filter(month => month["count"] === 0).length;
        expect(numOfPO).toEqual(11);

        const numOfAC = response.body["AC"].filter(
          month => month["count"] === 0
        ).length;
        expect(numOfAC).toEqual(12);

        const numOfCPD = response.body[
          PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation
        ].filter(month => month["count"] === 0).length;
        expect(numOfCPD).toEqual(12);
      });
    });

    test("should return complainant types for 6 months ago until 3 months ago if specified", async () => {
      await request(app)
        .get("/api/public-data")
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .query({
          queryType: QUERY_TYPES.COUNT_MONTHLY_COMPLAINTS_BY_COMPLAINANT_TYPE,
          minDate: moment().subtract(6, "months").format(ISO_DATE),
          maxDate: moment().subtract(3, "months").format(ISO_DATE)
        })
        .then(response => {
          expect(response.statusCode).toEqual(200);
          expect(
            response.body[PERSON_TYPE.KNOWN_OFFICER.abbreviation][2]["count"]
          ).toEqual(1);
          expect(
            response.body[PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation][0][
              "count"
            ]
          ).toEqual(0);
        });
    });
  });
});
