import {
  parseSearchTerm,
  buildQueryString,
  removeTags,
  updateSearchIndex
} from "./searchUtilities";
import models from "../../server/policeDataManager/models";
import { seedStandardCaseStatuses } from "../../server/testHelpers/testSeeding";
import { cleanupDatabase } from "../../server/testHelpers/requestTestHelpers";
import Case from "../../sharedTestHelpers/case";
import Civilian from "../../sharedTestHelpers/civilian";
import { COMPLAINANT } from "../constants";

describe("parseSearchTerm", () => {
  test("should return undefined if input is undefined", () => {
    expect(parseSearchTerm()).toBeUndefined();
    expect(parseSearchTerm(null)).toBeUndefined();
  });

  test("should return unchanged term when term has no spaces", () => {
    expect(parseSearchTerm("Seizure")).toEqual("Seizure");
    expect(parseSearchTerm("HeLlO!!")).toEqual("HeLlO!!");
  });

  test('should replace all spaces with " <<SPACE>> "', () => {
    expect(parseSearchTerm(" Search")).toEqual(" <<SPACE>> Search");
    expect(parseSearchTerm("Search ")).toEqual("Search <<SPACE>> ");
    expect(parseSearchTerm("Search and Seizure")).toEqual(
      "Search <<SPACE>> and <<SPACE>> Seizure"
    );
    expect(parseSearchTerm("Search      and       Seizure")).toEqual(
      "Search <<SPACE>> and <<SPACE>> Seizure"
    );
  });
});

describe("buildQueryString", () => {
  test("should asterisk all words if no operators, parens, or quotes", () => {
    expect(
      buildQueryString("I like tea and cakes for tea and cake time")
    ).toEqual("*I* *like* *tea* *and* *cakes* *for* *tea* *and* *cake* *time*");
  });

  test("should not asterisk operators", () => {
    expect(
      buildQueryString("I like tea AND cakes for tea OR cake time")
    ).toEqual("*I* *like* *tea* AND *cakes* *for* *tea* OR *cake* *time*");
  });

  test("should not asterisk quotes", () => {
    expect(
      buildQueryString('I "like tea" AND cakes for tea OR "cake time"')
    ).toEqual(
      '*I* "*like* *<<SPACE>>* *tea*" AND *cakes* *for* *tea* OR "*cake* *<<SPACE>>* *time*"'
    );
  });

  test("should add parens around NOT and next term", () => {
    expect(buildQueryString("NOT safe")).toEqual("(NOT *safe*)");
    expect(buildQueryString("NOT safe AND definitely NOT SAFe")).toEqual(
      "(NOT *safe*) AND *definitely* (NOT *SAFe*)"
    );
  });

  test("should handle parens after NOT", () => {
    expect(buildQueryString("NOT (safe)")).toEqual("(NOT (*safe*))");
  });

  test("should handle quotes after NOT", () => {
    expect(buildQueryString('NOT "safe time"')).toEqual(
      '(NOT "*safe* *<<SPACE>>* *time*")'
    );
  });

  test("should balance parens on field query", () => {
    expect(buildQueryString('tag:"Bob')).toEqual('tag.\\*:"*Bob*"');
    expect(buildQueryString('tag:Bob"')).toEqual('tag.\\*:"*Bob*"');
  });

  test("should not asterisk parens or a NOT just inside of parens", () => {
    expect(
      buildQueryString("I like (tea AND cakes for) (NOT tea OR cake) time")
    ).toEqual(
      "*I* *like* (*tea* AND *cakes* *for*) ((NOT *tea*) OR *cake*) *time*"
    );
  });

  test("should preprocess a declared search field to add .\\* but not prepend with *", () => {
    expect(buildQueryString("tag:Tofu accused:(Night OR Ansel) Fred")).toEqual(
      "tag.\\*:*Tofu* accused.\\*:(*Night* OR *Ansel*) *Fred*"
    );
  });

  test("should add asterisks around terms even when stuck between a colon and a parenthesis", () => {
    expect(
      buildQueryString("Tofu OR (complainant:Nigh AND complainant:Wat)")
    ).toEqual("*Tofu* OR (complainant.\\*:*Nigh* AND complainant.\\*:*Wat*)");
  });

  test('should replace (" with ("*', () => {
    expect(buildQueryString('("searchy")')).toEqual('("*searchy*")');
  });
});

describe("removeTags", () => {
  test("should remove tags", () => {
    expect(removeTags("I like tea and cakes")).toEqual("I like tea and cakes");
    expect(removeTags("<u>I like</u> tea and cakes")).toEqual(
      "I like tea and cakes"
    );
    expect(removeTags("I like <a href='#>tea and cakes</a>")).toEqual(
      "I like tea and cakes"
    );
    expect(removeTags("<b><u>I like</u> tea and cakes</b>")).toEqual(
      "I like tea and cakes"
    );
  });

  test("should add a space when replacing p and br tags", () => {
    expect(removeTags("<p>I</p>Am<br>So<br /><p>Tired</p>")).toEqual(
      " I Am So  Tired "
    );
  });
});

describe("updateSearchIndex", () => {
  const mockExists = jest.fn(() => Promise.resolve({ body: true }));
  const mockDelete = jest.fn(() => Promise.resolve());
  const mockCreate = jest.fn(() => Promise.resolve());
  const mockBulk = jest.fn(() => Promise.resolve());
  jest.mock("./search-index-config", () => ({
    [process.env.NODE_ENV]: { indexName: "index" }
  }));

  jest.mock("./create-configured-search-client", () =>
    jest.fn(() => ({
      indices: {
        exists: mockExists,
        delete: mockDelete,
        create: mockCreate
      },
      bulk: mockBulk,
      count: jest.fn(() => Promise.resolve({ body: { count: 1 } }))
    }))
  );

  test("should create delete and recreate the search index", async () => {
    await updateSearchIndex();
    expect(mockExists).toHaveBeenCalledWith({ index: "index" });
    expect(mockDelete).toHaveBeenCalledWith({ index: "index" });
    expect(mockCreate).toHaveBeenCalled();
  });

  test("should log when in verbose mode", async () => {
    const logSpy = jest.spyOn(console, "log");
    await updateSearchIndex(true);
    expect(logSpy).toHaveBeenCalledTimes(5);
  });

  describe("with results", () => {
    let c4se;
    beforeEach(async () => {
      mockBulk.mockClear();
      await cleanupDatabase();
      const statuses = await seedStandardCaseStatuses();
      c4se = await models.cases.create(
        new Case.Builder()
          .defaultCase()
          .withStatusId(statuses[0].id)
          .withPibCaseNumber("3999")
          .build(),
        { auditUser: "user" }
      );

      await models.civilian.create(
        new Civilian.Builder()
          .defaultCivilian()
          .withRoleOnCase(COMPLAINANT)
          .withCaseId(c4se.id)
          .build(),
        { auditUser: "user" }
      );
    });

    afterEach(async () => {
      await cleanupDatabase();
    });

    test("should call bulk with case data", async () => {
      await updateSearchIndex();
      expect(mockBulk).toHaveBeenCalledWith({
        refresh: true,
        body: [
          { index: { _index: "index" } },
          expect.objectContaining({
            case_id: c4se.id,
            complainant: [
              {
                full_name: "Chuck <<SPACE>> Berry <<SPACE>> XVI",
                full_name_with_initial:
                  "Chuck <<SPACE>> E <<SPACE>> Berry <<SPACE>> XVI"
              }
            ],
            narrative: {
              details: " <<SPACE>> test <<SPACE>> details <<SPACE>> ",
              summary: "test <<SPACE>> summary"
            },
            case_number: [c4se.caseReference, "3999"]
          })
        ]
      });
    });

    test("should log when in verbose mode", async () => {
      const logSpy = jest.spyOn(console, "log");
      logSpy.mockClear();
      await updateSearchIndex(true);
      expect(logSpy).toHaveBeenCalledTimes(6);
    });
  });
});
