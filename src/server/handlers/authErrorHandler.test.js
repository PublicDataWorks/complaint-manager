import authErrorHandler from "./authErrorHandler";
import { UNAUTHORIZED_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import Boom from "boom";

describe("authErrorHandler", () => {
  const next = jest.fn();
  beforeEach(() => {
    next.mockClear();
  });

  test("should convert unauthorized error into Boom Invalid Token error", () => {
    authErrorHandler(
      { name: UNAUTHORIZED_ERRORS.UNAUTHORIZED_ERROR },
      undefined,
      undefined,
      next
    );
    expect(next).toHaveBeenCalledWith(
      Boom.unauthorized(UNAUTHORIZED_ERRORS.INVALID_TOKEN)
    );
  });

  test("should simply pass through all other errors", () => {
    const error = new Error("sooooooooo error!!!");
    authErrorHandler(error, undefined, undefined, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
