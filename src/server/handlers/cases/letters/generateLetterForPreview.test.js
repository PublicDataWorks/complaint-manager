import httpMocks from "node-mocks-http";
import models from "../../../policeDataManager/models";
import generateLetterForPreview from "./generateLetterForPreview";
import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import Letter from "../../../../sharedTestHelpers/Letter";
import LetterType from "../../../../sharedTestHelpers/letterType";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import Signer from "../../../../sharedTestHelpers/signer";
import PersonType from "../../../../sharedTestHelpers/PersonType";
import {
  COMPLAINANT,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import Civilian from "../../../../sharedTestHelpers/civilian";

describe("generateLetterForPreview", () => {
  let c4se, letter, letterType, response, next;

  beforeEach(async () => {
    await cleanupDatabase();

    await models.personType.create(
      new PersonType.Builder().defaultPersonType().withIsDefault(true).build()
    );

    await models.personType.create(
      new PersonType.Builder()
        .defaultPersonType()
        .withKey("MVP")
        .withAbbreviation("MVP")
        .withDescription("Most Viable Player")
        .build()
    );

    response = httpMocks.createResponse();
    next = jest.fn();

    let signer = await models.signers.create(
      new Signer.Builder().defaultSigner().build(),
      { auditUser: "test user" }
    );

    letterType = await models.letter_types.create(
      new LetterType.Builder()
        .defaultLetterType()
        .withType("TEST LETTER TYPE")
        .withEditableTemplate("This is the letter template")
        .withDefaultSender(signer)
        .build(),
      { auditUser: "test user" }
    );

    let caseStatus = await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "test user" }
    );

    c4se = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withId(1)
        .withStatus(caseStatus)
        .withFirstContactDate("1-27-2023")
        .build(),
      { auditUser: "test user" }
    );

    await models.civilian.create(
      new Civilian.Builder()
        .defaultCivilian()
        .withPersonType("MVP")
        .withCaseId(c4se.id)
        .withRoleOnCase(COMPLAINANT)
        .build(),
      { auditUser: "user" }
    );
    c4se.reload({
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          include: ["personTypeDetails"]
        }
      ]
    });

    letter = await models.letter.create(
      new Letter.Builder()
        .defaultLetter()
        .withCaseId(c4se.id)
        .withTypeId(letterType.id)
        .build(),
      { auditUser: "test user" }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should return correct letter data", async () => {
    const request = {
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: c4se.id, letterId: letter.id },
      nickname: "nickname",
      permissions: [USER_PERMISSIONS.SETUP_LETTER]
    };
    await generateLetterForPreview(request, response, next);

    expect(next).not.toHaveBeenCalled();
    expect(response._getData().letterHtml).toEqual(letterType.editableTemplate);
    expect(response._getData().finalFilename).toEqual(
      `1-27-2023_${c4se.caseReference}_${letterType.type}.pdf`
    );
  });
});
