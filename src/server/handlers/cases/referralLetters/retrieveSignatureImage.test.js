import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import {
  retrieveSignatureImage,
  retrieveSignatureImageBySigner
} from "./retrieveSignatureImage";
import models from "../../../policeDataManager/models";
import Signer from "../../../../sharedTestHelpers/signer";

const mockGetObject = jest.fn((_, callback) => {
  let result = {
    ContentType: "image/bytes",
    ContentLength: 10,
    Body: {
      transformToString: jest.fn(() => "bytesbytesbytes")
    }
  };

  if (callback) {
    callback(undefined, result);
  }

  return Promise.resolve(result);
});
jest.mock("../../../createConfiguredS3Instance", () =>
  jest.fn(() => ({
    getObject: mockGetObject
  }))
);

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

  test("should throw error if s3 errors", async () => {
    const error = new Error("error to the max!!!");
    mockGetObject.mockImplementation((_, callback) => callback(error));

    try {
      await retrieveSignatureImage("filename", false);
      expect(false).toBeTrue(); // shouldn't hit this
    } catch (e) {
      expect(e).toEqual(error);
    }
  });
});
