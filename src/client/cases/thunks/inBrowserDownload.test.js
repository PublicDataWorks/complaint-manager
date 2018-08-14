import inBrowserDownload from "./inBrowserDownload";
import nock from "nock";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("in browser download thunk", function() {
  const testPath = "/some-path";
  const dispatch = jest.fn();

  test("should add an anchor html tag with the file to download", async () => {
    const responseData = "https://url of the file to download";

    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .get(testPath)
      .reply(200, responseData);

    const htmlAnchor = {
      href: "",
      click: jest.fn()
    };

    await inBrowserDownload(testPath, htmlAnchor)(dispatch);

    expect(htmlAnchor.href).toBe(responseData);
  });
});
