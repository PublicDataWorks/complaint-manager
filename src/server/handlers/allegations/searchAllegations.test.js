import Allegation from "../../../sharedTestHelpers/Allegation";
import CaseStatus from "../../../sharedTestHelpers/caseStatus";
import models from "../../policeDataManager/models";
import * as httpMocks from "node-mocks-http";
import searchAllegations from "./searchAllegations";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import { DEFAULT_PAGINATION_LIMIT } from "../../../sharedUtilities/constants";
import { createTestCaseWithoutCivilian } from "../../testHelpers/modelMothers";
import CaseOfficer from "../../../sharedTestHelpers/caseOfficer";
import Officer from "../../../sharedTestHelpers/Officer";

describe("searchAllegations handler", function () {
  let existingCase, caseOfficer;

  beforeEach(async () => {
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    existingCase = await createTestCaseWithoutCivilian();
    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);
    const officer = await models.officer.create(officerAttributes);
    const caseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(officer.id)
      .withCaseId(existingCase.id);
    caseOfficer = await models.case_officer.create(caseOfficerAttributes, {
      auditUser: "tuser"
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should return allegations based on rule", async () => {
    const allegationToCreate = new Allegation.Builder()
      .defaultAllegation()
      .withRule("Rule 4: Performance of Duty")
      .withId(undefined)
      .build();

    const createdAllegation = await models.allegation.create(
      allegationToCreate
    );

    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      query: {
        caseId: existingCase.id,
        caseOfficerId: caseOfficer.id,
        rule: createdAllegation.rule
      },
      nickname: "nickname"
    });

    const response = httpMocks.createResponse();
    await searchAllegations(request, response, jest.fn());

    expect(response._getData().rows[0].dataValues).toEqual(
      expect.objectContaining({
        rule: createdAllegation.rule,
        paragraph: createdAllegation.paragraph,
        directive: createdAllegation.directive
      })
    );
  });

  test("should return allegation based on partial match on directive", async () => {
    const forceAllegation = new Allegation.Builder()
      .defaultAllegation()
      .withId(undefined)
      .withDirective(
        "1.3.7 Use of Force Review Board 16-17 Responsibilities of the Board"
      )
      .build();

    const firearmsAllegation = new Allegation.Builder()
      .defaultAllegation()
      .withId(undefined)
      .withDirective("1.4 Authorized Firearms 1-2 Policy Statement Board")
      .build();

    await models.allegation.bulkCreate([forceAllegation, firearmsAllegation], {
      returning: true
    });

    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      query: {
        caseId: existingCase.id,
        caseOfficerId: caseOfficer.id,
        directive: "force"
      },
      nickname: "nickname"
    });

    const response = httpMocks.createResponse();
    await searchAllegations(request, response, jest.fn());

    expect(response._getData().rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          directive: forceAllegation.directive
        })
      ])
    );
  });

  test("should return allegation with multiple search criteria", async () => {
    const allegation1 = new Allegation.Builder()
      .defaultAllegation()
      .withId(undefined)
      .withRule("Test Rule A")
      .withParagraph("Test Paragraph C")
      .build();

    const allegation2 = new Allegation.Builder()
      .defaultAllegation()
      .withId(undefined)
      .withRule("Test Rule A")
      .withParagraph("Test Paragraph B")
      .build();

    const allegation3 = new Allegation.Builder()
      .defaultAllegation()
      .withId(undefined)
      .withRule("Test Rule B")
      .withParagraph("Test Paragraph B")
      .build();

    await models.allegation.bulkCreate(
      [allegation1, allegation2, allegation3],
      {
        returning: true
      }
    );

    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      query: {
        caseId: existingCase.id,
        caseOfficerId: caseOfficer.id,
        rule: "Test Rule A",
        paragraph: "Test Paragraph B"
      },
      nickname: "nickname"
    });

    const response = httpMocks.createResponse();

    await searchAllegations(request, response, jest.fn());

    expect(response._getData().rows.length).toEqual(1);
    expect(response._getData().rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rule: allegation2.rule,
          paragraph: allegation2.paragraph
        })
      ])
    );
  });

  test("should sort by rule, paragraph, directive", async () => {
    const allegation1 = new Allegation.Builder()
      .defaultAllegation()
      .withId(undefined)
      .withRule("Test Rule B")
      .withParagraph("Test Paragraph C")
      .withDirective("AA")
      .build();

    const allegation2 = new Allegation.Builder()
      .defaultAllegation()
      .withId(undefined)
      .withRule("Test Rule B")
      .withParagraph("Test Paragraph A")
      .withDirective("BB")
      .build();

    const allegation3 = new Allegation.Builder()
      .defaultAllegation()
      .withId(undefined)
      .withRule("Test Rule B")
      .withParagraph("Test Paragraph A")
      .withDirective("CC")
      .build();

    const allegation4 = new Allegation.Builder()
      .defaultAllegation()
      .withId(undefined)
      .withRule("Test Rule A")
      .withParagraph("Test Paragraph B")
      .withDirective("DD")
      .build();

    await models.allegation.bulkCreate(
      [allegation1, allegation2, allegation3, allegation4],
      {
        returning: true
      }
    );

    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      query: {
        caseId: existingCase.id,
        caseOfficerId: caseOfficer.id
      },
      nickname: "nickname"
    });

    const response = httpMocks.createResponse();

    await searchAllegations(request, response, jest.fn());

    expect(response._getData().rows).toEqual([
      expect.objectContaining({
        rule: "Test Rule A"
      }),
      expect.objectContaining({
        rule: "Test Rule B",
        paragraph: "Test Paragraph A",
        directive: "BB"
      }),
      expect.objectContaining({
        rule: "Test Rule B",
        paragraph: "Test Paragraph A",
        directive: "CC"
      }),
      expect.objectContaining({
        rule: "Test Rule B",
        paragraph: "Test Paragraph C",
        directive: "AA"
      })
    ]);
  });

  test("should handle pagination", async () => {
    const totalAllegations = DEFAULT_PAGINATION_LIMIT + 1;
    const allegations = [];
    for (let x = 1; x <= totalAllegations; x++) {
      const ruleNumber = `${x}`.length == 1 ? `0${x}` : x;
      allegations.push(
        new Allegation.Builder()
          .defaultAllegation()
          .withId(undefined)
          .withRule(`Test Rule ${ruleNumber}`)
          .build()
      );
    }

    await models.allegation.bulkCreate(allegations);

    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      query: {
        caseId: existingCase.id,
        caseOfficerId: caseOfficer.id,
        page: 2
      },
      nickname: "nickname"
    });

    const response = httpMocks.createResponse();

    await searchAllegations(request, response, jest.fn());

    expect(response._getData().rows.length).toEqual(1);
    expect(response._getData().rows).toEqual([
      expect.objectContaining({
        rule: `Test Rule ${totalAllegations}`
      })
    ]);
  });
});
