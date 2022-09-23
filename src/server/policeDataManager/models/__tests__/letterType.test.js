import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import LetterType from "../../../../sharedTestHelpers/letterType";
import Signer from "../../../../sharedTestHelpers/signer";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import models from "../index";

describe("LetterType", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("toPayload", () => {
    let signer, letterType, status;
    beforeEach(async () => {
      signer = await models.signers.create(
        new Signer.Builder().defaultSigner().build(),
        { auditUser: "user" }
      );

      status = await models.caseStatus.create(
        new CaseStatus.Builder().defaultCaseStatus().build(),
        { auditUser: "user" }
      );

      letterType = await models.letter_types.create(
        new LetterType.Builder()
          .defaultLetterType()
          .withDefaultSender(signer)
          .withRequiredStatus(status)
          .build(),
        { auditUser: "user" }
      );
    });

    test("should remove updatedAt and createdAt from letterType and defaultSender along with requiredStatusId and defaultSenderId", async () => {
      let type = await models.letter_types.findByPk(letterType.id, {
        include: ["defaultSender"]
      });
      type = type.toPayload(type);
      expect(type.requiredStatusId).toBeUndefined();
      expect(type.defaultSenderId).toBeUndefined();
      expect(type.createdAt).toBeUndefined();
      expect(type.updatedAt).toBeUndefined();
      expect(type.defaultSender.createdAt).toBeUndefined();
      expect(type.defaultSender.updatedAt).toBeUndefined();
    });

    test("should collapse requiredStatus to a string", async () => {
      let type = await models.letter_types.findByPk(letterType.id, {
        include: ["requiredStatus"]
      });
      type = type.toPayload(type);
      expect(type.requiredStatus).toEqual(status.name);
    });
  });
});
