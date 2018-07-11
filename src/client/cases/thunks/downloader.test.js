import FileSaver from "file-saver";
import downloader from "./downloader";
import nock from "nock";
import { UTF8_BYTE_ORDER_MARK } from "../../../sharedUtilities/constants";

jest.mock("file-saver", () => ({
  saveAs: jest.fn()
}));
jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("downloader thunk", function() {
  const testPath = "/some-path";
  const dispatch = jest.fn();

  test("should add utf8 BOM when downloading csv", async () => {
    const responseData = "some response";
    const fileName = "test_file.csv";
    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .get("/some-path")
      .reply(200, responseData);

    await downloader(testPath, fileName, true)(dispatch);
    const expectedFile = new File(
      [UTF8_BYTE_ORDER_MARK + responseData],
      fileName
    );
    expect(FileSaver.saveAs).toHaveBeenCalledWith(expectedFile, fileName);
  });

  test("should not add utf8 BOM when downloading attachment", async () => {
    const responseData = "some response";
    const fileName = "test_file.csv";
    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .get("/some-path")
      .reply(200, responseData);

    await downloader(testPath, fileName, false)(dispatch);
    const expectedFile = new File([responseData], fileName);
    expect(FileSaver.saveAs).toHaveBeenCalledWith(expectedFile, fileName);
  });
});
