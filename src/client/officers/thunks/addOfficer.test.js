import addOfficer from "./addOfficer";
import nock from "nock";
import { push } from "react-router-redux";
import Officer from "../../testUtilities/Officer";
import Case from "../../testUtilities/case";
import {
  addOfficerToCaseFailure,
  addOfficerToCaseSuccess,
  clearSelectedOfficer
} from "../../actionCreators/officersActionCreators";
import { ACCUSED } from "../../../sharedUtilities/constants";
import configureInterceptors from "../../axiosInterceptors/interceptors";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("addOfficer", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    dispatch.mockClear();
    configureInterceptors({ dispatch });
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
});
