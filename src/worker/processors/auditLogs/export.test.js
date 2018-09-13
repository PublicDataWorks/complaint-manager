const httpMocks = require("node-mocks-http");
const exportAuditLogs = require("./export");

describe("audit log export", function() {
  test("should call next when error received from db (missing nickname)", async () => {
    const request = httpMocks.createRequest({
      method: "GET"
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();
    await exportAuditLogs(request, response, next);

    expect(next).toHaveBeenCalled();
  });
});
