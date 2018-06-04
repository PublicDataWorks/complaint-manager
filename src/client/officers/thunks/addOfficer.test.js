import addOfficer from "./addOfficer";
import nock from "nock";
import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import Officer from "../../testUtilities/Officer";
import Case from "../../testUtilities/case";
import {
  addOfficerToCaseFailure,
  addOfficerToCaseSuccess,
  clearSelectedOfficer
} from "../../actionCreators/officersActionCreators";
import { ACCUSED } from "../../../sharedUtilities/constants";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("addOfficer", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    getAccessToken.mockClear();
    dispatch.mockClear();
  });

  test("should dispatch success, clear selected officer, and redirect to caseDetails when successful", async () => {
    const officer = new Officer.Builder().defaultOfficer().withId(14);
    const defaultCase = new Case.Builder().defaultCase().withId(14);
    const formValues = {
      roleOnCase: ACCUSED,
      notes: "Some very very very important notes"
    };
    const payload = { officerId: officer.id, ...formValues };

    const responseBody = { updatedCaseProp: "updatedCaseValues" };

    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post(
        `/api/cases/${defaultCase.id}/cases-officers`,
        JSON.stringify(payload)
      )
      .reply(200, responseBody);

    await addOfficer(defaultCase.id, officer.id, formValues)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      addOfficerToCaseSuccess(responseBody)
    );
    expect(dispatch).toHaveBeenCalledWith(clearSelectedOfficer());
    expect(dispatch).toHaveBeenCalledWith(push(`/cases/${defaultCase.id}`));
  });

  test("should dispatch failure when fails", async () => {
    const officer = new Officer.Builder().defaultOfficer().withId(14);
    const defaultCase = new Case.Builder().defaultCase().withId(14);
    const formValues = {
      roleOnCase: ACCUSED,
      notes: "Some very very very important notes"
    };
    const payload = { officerId: officer.id, ...formValues };

    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post(
        `/api/cases/${defaultCase.id}/cases-officers`,
        JSON.stringify(payload)
      )
      .reply(500);

    await addOfficer(defaultCase.id, officer.id, formValues)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(addOfficerToCaseFailure());
  });

  test("should not dispatch success and should redirect when 401 response", async () => {
    const officer = new Officer.Builder().defaultOfficer().withId(14);
    const defaultCase = new Case.Builder().defaultCase().withId(14);
    const formValues = {
      roleOnCase: ACCUSED,
      notes: "Some very very very important notes"
    };
    const payload = { officerId: officer.id, ...formValues };

    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post(
        `/api/cases/${defaultCase.id}/cases-officers`,
        JSON.stringify(payload)
      )
      .reply(401);

    await addOfficer(defaultCase.id, officer.id, formValues)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
  });

  test("should redirect immediately if token missing", async () => {
    getAccessToken.mockImplementation(() => false);

    await addOfficer()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
  });
});
