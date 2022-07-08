import httpMocks from "node-mocks-http";
import Boom from "boom";
import Busboy from "busboy";
import uploadSignature from "./uploadSignature";
import createConfiguredS3Instance from "../../createConfiguredS3Instance";
import { auditFileAction } from "../audits/auditFileAction";
import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE
} from "../../../sharedUtilities/constants";

jest.mock("../audits/auditFileAction");
jest.mock("busboy");
Busboy.mockImplementation(() => {
  return {
    on: jest.fn(async (field, func) => {
      if (field === "field") {
        await func("name", "file.png");
        await func("type", "image/gif");
        await func("random", "stuff");
      }
      if (field === "file") {
        await func(jest.fn(), jest.fn(), { filename: "test_filename" });
      }
    })
  };
});

jest.mock("../../createConfiguredS3Instance");

describe("uploadSignature", () => {
  let request, response, next;

  const testUser = "Rabbid Penguin";

  beforeEach(async () => {
    response = httpMocks.createResponse();
    request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer token"
      },
      nickname: testUser,
      pipe: jest.fn()
    });

    next = jest.fn();
    auditFileAction.mockImplementation(() => Promise.resolve());
  });

  describe("Upload Fails", () => {
    beforeEach(() => {
      createConfiguredS3Instance.mockImplementation(() => {
        return {
          upload: jest.fn(() => {
            return {
              promise: () => ({
                then: (success, failure) => failure("EPIC FAIL!")
              })
            };
          })
        };
      });
    });

    test("should call next with a bad implementation error", async () => {
      await uploadSignature(request, response, next);

      expect(next).toHaveBeenCalledWith(Boom.badImplementation("EPIC FAIL!"));
    });
  });

  describe("Upload Succeeds", () => {
    let uploadAbort = jest.fn();
    beforeEach(() => {
      createConfiguredS3Instance.mockImplementation(() => {
        return {
          upload: jest.fn(() => {
            return {
              promise: () => {
                return Promise.resolve("Successful S3 upload");
              },
              abort: uploadAbort
            };
          })
        };
      });
    });

    test("should set access-control-allow-origin response header if only in the development env", async () => {
      process.env.NODE_ENV = "development";

      await uploadSignature(request, response, next);

      expect(response._headers).toEqual(
        expect.objectContaining({
          "access-control-allow-origin": "https://localhost"
        })
      );
    });

    test("should return the name of the file", async () => {
      await uploadSignature(request, response, next);
      expect(response._getData()).toEqual({ name: "file.png" });
    });

    describe("auditing", () => {
      test("should call auditFileAction when uploading a signature", async () => {
        await uploadSignature(request, response, next);

        expect(auditFileAction).toHaveBeenCalledWith(
          testUser,
          undefined,
          AUDIT_ACTION.UPLOADED,
          "file.png",
          AUDIT_FILE_TYPE.SIGNATURE
        );
      });
    });
  });
});
