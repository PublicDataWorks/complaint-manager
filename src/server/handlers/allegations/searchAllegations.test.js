import Allegation from "../../../client/testUtilities/Allegation";
import models from "../../models";
import * as httpMocks from "node-mocks-http";
import searchAllegations from "./searchAllegations";
import { cleanupDatabase } from "../../requestTestHelpers";

afterEach(async () => {
  await cleanupDatabase();
});

test("should return allegations based on rule", async () => {
  const allegationToCreate = new Allegation.Builder()
    .defaultAllegation()
    .withRule("Rule 4: Performance of Duty")
    .withId(undefined)
    .build();

  const createdAllegation = await models.allegation.create(allegationToCreate);

  const request = httpMocks.createRequest({
    method: "GET",
    headers: {
      authorization: "Bearer SOME_MOCK_TOKEN"
    },
    query: {
      rule: createdAllegation.rule
    }
  });

  const response = httpMocks.createResponse();
  await searchAllegations(request, response, jest.fn());

  expect(response._getData()[0].dataValues).toEqual(
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
      directive: "force"
    }
  });

  const response = httpMocks.createResponse();
  await searchAllegations(request, response, jest.fn());

  expect(response._getData()).toEqual(
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

  await models.allegation.bulkCreate([allegation1, allegation2, allegation3], {
    returning: true
  });

  const request = httpMocks.createRequest({
    method: "GET",
    headers: {
      authorization: "Bearer SOME_MOCK_TOKEN"
    },
    query: {
      rule: "Test Rule A",
      paragraph: "Test Paragraph B"
    }
  });

  const response = httpMocks.createResponse();

  await searchAllegations(request, response, jest.fn());

  expect(response._getData().length).toEqual(1);
  expect(response._getData()).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        rule: allegation2.rule,
        paragraph: allegation2.paragraph
      })
    ])
  );
});
