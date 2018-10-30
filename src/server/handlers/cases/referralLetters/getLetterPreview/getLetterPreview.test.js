import getLetterPreview from "./getLetterPreview";
import httpMocks from "node-mocks-http";
import {
  ACCUSED,
  ADDRESSABLE_TYPE,
  CASE_STATUS,
  COMPLAINANT,
  WITNESS
} from "../../../../../sharedUtilities/constants";
import Case from "../../../../../client/testUtilities/case";
import Address from "../../../../../client/testUtilities/Address";
import models from "../../../../models";
import { cleanupDatabase } from "../../../../testHelpers/requestTestHelpers";
import Civilian from "../../../../../client/testUtilities/civilian";
import Officer from "../../../../../client/testUtilities/Officer";
import CaseOfficer from "../../../../../client/testUtilities/caseOfficer";
import LetterOfficer from "../../../../../client/testUtilities/LetterOfficer";

describe("getLetterPreview", function() {
  let existingCase, request, response, next;

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    const caseAttributes = new Case.Builder().defaultCase().withId(12070);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });
    await existingCase.update(
      { status: CASE_STATUS.ACTIVE },
      { auditUser: "test" }
    );
    await existingCase.update(
      { status: CASE_STATUS.LETTER_IN_PROGRESS },
      { auditUser: "test" }
    );

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: existingCase.id },
      nickname: "nickname"
    });

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("renders civilian info", async () => {
    const civilianComplainantAttributes1 = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withFirstName("Bob")
      .withLastName("Smith")
      .withCaseId(existingCase.id);

    const civilianComplainantAttributes2 = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withFirstName("Lisa")
      .withLastName("Brown")
      .withCaseId(existingCase.id);

    const civilianComplainant1 = await models.civilian.create(
      civilianComplainantAttributes1,
      { auditUser: "someone" }
    );

    const civilianComplainant2 = await models.civilian.create(
      civilianComplainantAttributes2,
      { auditUser: "someone" }
    );

    const address1Attributes = new Address.Builder()
      .defaultAddress()
      .withId(undefined)
      .withStreetAddress("123 Main St")
      .withCity("Chicago")
      .withState("IL")
      .withZipCode("60601")
      .withCountry("USA")
      .withAddressableId(civilianComplainant1.id)
      .withAddressableType(ADDRESSABLE_TYPE.CIVILIAN)
      .withIntersection(undefined);
    await models.address.create(address1Attributes, { auditUser: "testuser" });

    const address2Attributes = new Address.Builder()
      .defaultAddress()
      .withId(undefined)
      .withIntersection("Canal St & Bourbon St")
      .withCity("Chicago")
      .withState("IL")
      .withZipCode("60661")
      .withCountry("USA")
      .withAddressableId(civilianComplainant2.id)
      .withAddressableType(ADDRESSABLE_TYPE.CIVILIAN)
      .withStreetAddress(undefined);
    await models.address.create(address2Attributes, { auditUser: "testuser" });

    await getLetterPreview(request, response, next);

    expect(response._getData()).toMatch(civilianComplainant1.fullName);
    expect(response._getData()).toMatch(civilianComplainant2.fullName);

    expect(response._getData()).toMatch("123 Main St, Chicago, IL 60601");
    expect(response._getData()).toMatch(
      "Canal St & Bourbon St, Chicago, IL 60661"
    );
  });

  test("it renders officer complainants", async () => {
    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

    const officer = await models.officer.create(officerAttributes, {
      auditUser: "someone"
    });

    const caseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(officer.id)
      .withCaseId(existingCase.id)
      .withFirstName("Roger")
      .withLastName("Williams")
      .withRoleOnCase(COMPLAINANT);

    const caseOfficer = await models.case_officer.create(
      caseOfficerAttributes,
      { auditUser: "someone" }
    );

    await getLetterPreview(request, response, next);

    expect(response._getData()).toMatch(caseOfficer.fullName);
  });

  test("it renders the accused officers", async () => {
    const knownOfficerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

    const knownOfficer = await models.officer.create(knownOfficerAttributes, {
      auditUser: "someone"
    });

    const knownCaseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(knownOfficer.id)
      .withCaseId(existingCase.id)
      .withFirstName("Sam")
      .withLastName("Smith")
      .withRoleOnCase(ACCUSED);

    const unknownCaseOfficerAttributes = new CaseOfficer.Builder()
      .withUnknownOfficer()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withRoleOnCase(ACCUSED);

    const knownCaseOfficer = await models.case_officer.create(
      knownCaseOfficerAttributes,
      { auditUser: "someone" }
    );

    const unknownCaseOfficer = await models.case_officer.create(
      unknownCaseOfficerAttributes,
      { auditUser: "someone" }
    );

    const knownLetterOfficerAttributes = new LetterOfficer.Builder()
      .defaultLetterOfficer()
      .withId(undefined)
      .withCaseOfficerId(knownCaseOfficer.id);

    await models.letter_officer.create(knownLetterOfficerAttributes, {
      auditUser: "someone"
    });

    const unknownLetterOfficerAttributes = new LetterOfficer.Builder()
      .defaultLetterOfficer()
      .withId(undefined)
      .withCaseOfficerId(unknownCaseOfficer.id);

    await models.letter_officer.create(unknownLetterOfficerAttributes, {
      auditUser: "someone"
    });

    await getLetterPreview(request, response, next);

    expect(response._getData()).toMatch(knownCaseOfficer.fullName);
    expect(response._getData()).toMatch(unknownCaseOfficer.fullName);
  });

  test("it renders the witnesses", async () => {
    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

    const officer = await models.officer.create(officerAttributes, {
      auditUser: "someone"
    });

    const caseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(officer.id)
      .withCaseId(existingCase.id)
      .withFirstName("Sam")
      .withLastName("Smith")
      .withRoleOnCase(WITNESS);

    const caseOfficer = await models.case_officer.create(
      caseOfficerAttributes,
      { auditUser: "someone" }
    );

    const civilianWitnessAttributes = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withFirstName("Bob")
      .withLastName("Smith")
      .withCaseId(existingCase.id)
      .withRoleOnCase(WITNESS);

    const civilianWitness = await models.civilian.create(
      civilianWitnessAttributes,
      { auditUser: "someone" }
    );

    await getLetterPreview(request, response, next);

    expect(response._getData()).toMatch(caseOfficer.fullName);
    expect(response._getData()).toMatch(civilianWitness.fullName);
  });
});
