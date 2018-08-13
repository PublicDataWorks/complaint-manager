import inBrowserDownload from "./inBrowserDownload";
import nock from "nock";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("in browser download thunk", function() {
  const testPath = "/some-path";
  const dispatch = jest.fn();

  test("should add an anchor html tag with the file to download", async () => {
    const responseData = "https://url of the file to download";
    const fileName = "test_file.csv";

    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .get("/some-path")
      .reply(200, responseData);

    await inBrowserDownload(testPath, fileName, true)(dispatch);

    const anchor = document.getElementsByTagName("a");
    expect(anchor[0].href).toBe(responseData);
  });
});
