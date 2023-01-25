import axios from "axios";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import editCase from "../../../../server/handlers/cases/editCase";
import { USER_PERMISSIONS } from "../../../../sharedUtilities/constants";
import { response } from "express";
const httpMocks = require("node-mocks-http");
//const editCase = require("./editCase");
const Boom = require("boom");

const updateCase = updateDetails => async dispatch => {
  //let next = jest.fn();
  try {
    // const request = httpMocks.createRequest({
    //   method: "PUT",
    //   headers: {
    //     authorization: "Bearer SOME_MOCK_TOKEN"
    //   },
    //   params: { caseId: updateDetails.id },
    //   body: updateDetails,
    //   nickname: "TEST_USER_NICKNAME",
    //   permissions: USER_PERMISSIONS.EDIT_CASE
    // });
    // const response = await axios.put(
    //   `api/cases/${updateDetails.id}/`,
    //   JSON.stringify({
    //     assignedTo: updateDetails.assignedTo
    //   })
    // );
    // await editCase(request, response, next);

    //response = httpMocks.createResponse();
    next = jest.fn();

    request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: { caseId: updateDetails.id },
      body: updateDetails,
      nickname: "TEST_USER_NICKNAME",
      permissions: USER_PERMISSIONS.EDIT_CASE
    });

    const response = await axios.put(
      `api/cases/${updateDetails.id}`,
      JSON.stringify({
        assignedTo: updateDetails.assignedTo
      })
    );

    await editCase(request, response, next);

    return dispatch(snackbarSuccess("Case was successfully updated"));
  } catch (e) {}
};

export default updateCase;
