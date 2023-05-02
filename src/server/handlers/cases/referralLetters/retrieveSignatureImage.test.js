import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import {
  retrieveSignatureImage,
  retrieveSignatureImageBySigner
} from "./retrieveSignatureImage";
import models from "../../../policeDataManager/models";
import Signer from "../../../../sharedTestHelpers/signer";

jest.mock("../../../createConfiguredS3Instance");

const BLANK_LINE = "<p><br></p>";

describe("retreiveSignatureImageBySigner", function () {
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

  const sender = `${NAME}\nDPM`;

  test("returns an blank line without signature when no signature for given name", async () => {
    expect(await retrieveSignatureImageBySigner("someone not sender")).toEqual(
      BLANK_LINE
    );
  });

  test("returns official signature when they are the sender", async () => {
    const signature = await retrieveSignatureImageBySigner(sender);

    expect(signature).toEqual(
      `<img style="max-height: 55px" src="data:image/bytes;base64,bytesbytesbytes" />`
    );
  });

  test("returns blank line when no sender is passed in", async () => {
    const signature = await retrieveSignatureImageBySigner();

    expect(signature).toEqual(BLANK_LINE);
  });
});

describe("retrieveSignatureImage", () => {
  test("should return blank line if fileName is undefined and includeHtmlTag is true", async () => {
    expect(await retrieveSignatureImage()).toEqual(BLANK_LINE);
  });

  test("should return undefined if fileName is undefined and includeHtmlTag is false", async () => {
    expect(await retrieveSignatureImage(undefined, false)).toBeUndefined();
  });
});
