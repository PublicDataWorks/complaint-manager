import addOfficer from "./addOfficer";
import nock from "nock";
import { push } from "connected-react-router";
import { startSubmit, stopSubmit } from "redux-form";
import Officer from "../../../../sharedTestHelpers/Officer";
import Case from "../../../../sharedTestHelpers/case";
import {
  addOfficerToCaseSuccess,
  clearCaseEmployeeType,
  clearSelectedOfficer
} from "../../actionCreators/officersActionCreators";
import {
  ACCUSED,
  OFFICER_DETAILS_FORM_NAME
} from "../../../../sharedUtilities/constants";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

jest.mock("../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

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
      notes: "Some very very very important notes",
      phoneNumber: "8005882300",
      email: "AVeryGoodBoi@gmail.com"
    };
    const payload = {
      officerId: officer.id,
      caseEmployeeType: PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription,
      ...formValues
    };

    const responseBody = { updatedCaseProp: "updatedCaseValues" };

    nock("http://localhost")
      .post(
        `/api/cases/${defaultCase.id}/cases-officers`,
        JSON.stringify(payload)
      )
      .reply(200, responseBody);

    await addOfficer(
      defaultCase.id,
      officer.id,
      PERSON_TYPE.CIVILIAN_WITHIN_PD.employeeDescription,
      formValues
    )(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      startSubmit(OFFICER_DETAILS_FORM_NAME)
    );
    expect(dispatch).toHaveBeenCalledWith(
      addOfficerToCaseSuccess(responseBody)
    );
    expect(dispatch).toHaveBeenCalledWith(clearCaseEmployeeType());
    expect(dispatch).toHaveBeenCalledWith(clearSelectedOfficer());
    expect(dispatch).toHaveBeenCalledWith(push(`/cases/${defaultCase.id}`));
    expect(dispatch).toHaveBeenCalledWith(
      stopSubmit(OFFICER_DETAILS_FORM_NAME)
    );
  });
});
