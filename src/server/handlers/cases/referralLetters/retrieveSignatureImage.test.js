import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { retrieveSignatureImage } from "./retrieveSignatureImage";
import models from "../../../policeDataManager/models";
import Signer from "../../../../sharedTestHelpers/signer";

jest.mock("../../../createConfiguredS3Instance", () =>
  jest.fn(() => ({
    getObject: jest.fn((opts, callback) =>
      callback(undefined, {
        ContentType: "image/bytes",
        Body: {
          toString: () => "bytesbytesbytes"
        }
      })
    )
  }))
);

describe("generateSignature", function () {
  const NAME = "Billy";
  beforeAll(async () => {
    await cleanupDatabase();
    const signer = new Signer.Builder().defaultSigner().withName(NAME).build();
    await models.sequelize.transaction(async transaction => {
      await models.signers.create(signer, { auditUser: "user", transaction });
    });
  });

  afterAll(async () => {
    await cleanupDatabase();
    await models.sequelize.close();
  });

  const blankLine = "<p><br></p>";
  const sender = `${NAME}\nDPM`;

  test("returns an blank line without signature when no signature for given name", async () => {
    expect(await retrieveSignatureImage("someone not sender")).toEqual(
      blankLine
    );
  });

  test("returns official signature when they are the sender", async () => {
    const signature = await retrieveSignatureImage(sender);

    expect(signature).toEqual(
      `<img style="max-height: 55px" src="data:image/bytes;base64,bytesbytesbytes" />`
    );
  });
});
