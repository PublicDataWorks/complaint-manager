import LetterType from "../../../../sharedTestHelpers/letterType";
import Signer from "../../../../sharedTestHelpers/signer";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import models from "../index";
import { mapSignerToPayload } from "./signerHelpers";

describe("signerHelpers", () => {
  describe("mapSignerToPayload", () => {
    let signer;
    beforeEach(async () => {
      await cleanupDatabase();
      signer = await models.signers.create(
        new Signer.Builder().defaultSigner().build(),
        { auditUser: "user" }
      );
    });

    afterEach(async () => {
      await cleanupDatabase();
    });

    test("should map a signer model to a payload object", async () => {
      expect(await mapSignerToPayload(signer)).toEqual({
        id: signer.id,
        name: signer.name,
        nickname: signer.nickname,
        title: signer.title,
        phone: signer.phone,
        links: [
          {
            rel: "signature",
            href: `/api/signers/${signer.id}/signature`
          },
          {
            rel: "delete",
            href: `/api/signers/${signer.id}`,
            method: "delete"
          }
        ]
      });
    });

    test("should not include a delete link if the signer is a default sender on a letter", async () => {
      await models.letter_types.create(
        new LetterType.Builder()
          .defaultLetterType()
          .withDefaultSender(signer)
          .build(),
        { auditUser: "user" }
      );

      expect(await mapSignerToPayload(signer)).toEqual({
        id: signer.id,
        name: signer.name,
        nickname: signer.nickname,
        title: signer.title,
        phone: signer.phone,
        links: [
          {
            rel: "signature",
            href: `/api/signers/${signer.id}/signature`
          }
        ]
      });
    });
  });
});
