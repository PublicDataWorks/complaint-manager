import { mount } from "enzyme";
import React from "react";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import {
  getCaseDetailsSuccess,
  openCaseStatusUpdateDialog
} from "../../../actionCreators/casesActionCreators";
import { USER_PERMISSIONS } from "../../../../../sharedUtilities/constants";
import { userAuthSuccess } from "../../../../common/auth/actionCreators";
import CaseStatusStepper from "./CaseStatusStepper";
import { BrowserRouter as Router } from "react-router-dom";
import getActiveStep from "./getActiveStep";
import nock from "nock";
import "@testing-library/jest-dom";
import {render, waitFor, screen} from '@testing-library/react';

describe("CaseStatusStepper", () => {
  let store, responseBody, caseStatusMap, getAllCaseStatuses;
  beforeEach(() => {
    store = createConfiguredStore();

    responseBody = [
      {"id":1,"name":"Initial","orderKey":0},
      {"id":2,"name":"Active","orderKey":1},
      {"id":3,"name":"Letter in Progress","orderKey":2},
      {"id":4,"name":"Ready for Review","orderKey":3},
      {"id":5,"name":"Forwarded to Agency","orderKey":4},
      {"id":6,"name":"Closed","orderKey":5}
    ];
    
    nock.cleanAll();
    getAllCaseStatuses = nock("http://localhost").get(`/api/case-statuses`).reply(200, responseBody);

    caseStatusMap = {
      ["Initial"]: 0,
      ["Active"]: 1,
      ["Letter in Progress"]: 2,
      ["Ready for Review"]: 3,
      ["Forwarded to Agency"]: 4,
      ["Closed"]: 5
    };
  });

  test("should set status to Initial", async () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: responseBody[0].name,
        nextStatus: "blah"
      })
    );

    render(
      <Provider store={store}>
        <CaseStatusStepper />
      </Provider>
    );

    await waitFor(() => screen.getByTestId("statusStepper"));
    
    await new Promise(resolve => {
      getAllCaseStatuses.on("replied", () => {
        resolve();
      });
    });

    expect(await screen.findByText("Initial")).toHaveStyle("color: rgba(0, 0, 0, 0.87)");
  });

  test("should set status to Forwarded to Agency", async () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: responseBody[4].name,
        nextStatus: "blah"
      })
    );

    render(
      <Provider store={store}>
        <Router>
          <CaseStatusStepper />
        </Router>
      </Provider>
    );

    await waitFor(() => screen.getByTestId("statusStepper"));
    
    await new Promise(resolve => {
      getAllCaseStatuses.on("replied", () => {
        resolve();
      });
    });

    expect(await screen.findByText("Forwarded to Agency")).toHaveStyle("color: rgba(0, 0, 0, 0.87)");
  });

  test("should open update status dialog with redirect url if next status is letter in progress", () => {
    const dispatchSpy = jest.spyOn(store, "dispatch");
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        status: responseBody[1].name,
        nextStatus: responseBody[2].name,
      })
    );
    store.dispatch({
      type: "AUTH_SUCCESS",
      userInfo: { permissions: [USER_PERMISSIONS.SETUP_LETTER] }
    });

    const wrapper = mount(
      <Provider store={store}>
        <CaseStatusStepper />
      </Provider>
    );

    const updateStatusButton = wrapper
      .find('[data-testid="update-status-button"]')
      .first();

    updateStatusButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openCaseStatusUpdateDialog(
        responseBody[2].name,
        `/cases/1/letter/review`
      )
    );
  });

  describe("with permissions", () => {
    beforeEach(() => {
      store.dispatch(
        userAuthSuccess({
          permissions: [
            USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES,
            USER_PERMISSIONS.SETUP_LETTER
          ]
        })
      );
    });

    test("should NOT show a button when a case is initial", () => {
      store.dispatch(
        getCaseDetailsSuccess({
          id: 1,
          status: responseBody[0].name,
          nextStatus: "blah"
        })
      );

      const wrapper = mount(
        <Provider store={store}>
          <CaseStatusStepper />
        </Provider>
      );

      const updateStatusButton = wrapper
        .find('[data-testid="update-status-button"]')
        .first();

      expect(updateStatusButton.exists()).toBeFalsy();
    });

    test("should show `Begin Letter` button when case is active", () => {
      store.dispatch(
        getCaseDetailsSuccess({
          id: 1,
          status: responseBody[1].name,
          nextStatus: responseBody[2].name
        })
      );

      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      const updateStatusButton = wrapper
        .find('[data-testid="update-status-button"]')
        .first();

      expect(updateStatusButton.exists()).toBeTruthy();
      expect(updateStatusButton.text()).toEqual(`Begin Letter`);
    });

    test("should show resume letter button when case is in letter in progress status", () => {
      store.dispatch(
        getCaseDetailsSuccess({
          id: 1,
          status: responseBody[2].name,
          nextStatus: responseBody[3].name
        })
      );

      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      const updateStatusButton = wrapper
        .find('[data-testid="edit-letter-button"]')
        .first();

      expect(updateStatusButton.text()).toEqual(`Resume Letter`);
    });

    test("should show edit letter button when case is in ready for review status", () => {
      store.dispatch(
        getCaseDetailsSuccess({
          id: 1,
          status: responseBody[3].name,
          nextStatus: responseBody[4].name
        })
      );

      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      const updateStatusButton = wrapper
        .find('[data-testid="edit-letter-button"]')
        .first();

      expect(updateStatusButton.text()).toEqual(`Edit Letter`);
    });

    test("should show edit letter button when case is in forwarded to agency status", () => {
      store.dispatch(
        getCaseDetailsSuccess({
          id: 1,
          status: responseBody[4].name,
          nextStatus: responseBody[5].name
        })
      );

      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      const updateStatusButton = wrapper
        .find('[data-testid="edit-letter-button"]')
        .first();

      expect(updateStatusButton.text()).toEqual(`Edit Letter Details`);
    });

    test("should show review and approve letter button when case is in ready for review status", () => {
      store.dispatch(
        getCaseDetailsSuccess({
          id: 1,
          status: responseBody[3].name,
          nextStatus: responseBody[4].name
        })
      );

      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      const reviewAndApproveLetterButton = wrapper
        .find('[data-testid="review-and-approve-letter-button"]')
        .first();

      expect(reviewAndApproveLetterButton.text()).toEqual(
        `Review and Approve Letter`
      );
    });

    test("should open update status dialog without redirect url if next status is closed", () => {
      const dispatchSpy = jest.spyOn(store, "dispatch");
      store.dispatch(
        getCaseDetailsSuccess({
          id: 1,
          status: responseBody[4].name,
          nextStatus: responseBody[5].name
        })
      );

      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      const updateStatusButton = wrapper
        .find('[data-testid="update-status-button"]')
        .first();

      updateStatusButton.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        openCaseStatusUpdateDialog(responseBody[5].name)
      );
    });

    test("should show edit letter button when status is closed", () => {
      store.dispatch(
        getCaseDetailsSuccess({
          id: 1,
          status: responseBody[5].name
        })
      );

      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      const updateStatusButton = wrapper
        .find('[data-testid="edit-letter-button"]')
        .first();

      expect(updateStatusButton.text()).toEqual(`Edit Letter Details`);
    });

    test("should not render Closed if already closed", () => {
      store.dispatch(
        getCaseDetailsSuccess({
          id: 1,
          status: responseBody[5].name
        })
      );

      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      const updateStatusButton = wrapper
        .find('[data-testid="update-status-button"]')
        .first();

      expect(updateStatusButton.exists()).toBeFalsy();
    });
  });

  describe("without permissions", () => {
    beforeEach(() => {
      store.dispatch(
        userAuthSuccess({
          permissions: [USER_PERMISSIONS.MANAGE_TAGS]
        })
      );
    });

    test("should not show Begin Letter button", () => {
      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      expect(wrapper.find('[data-testid="update-status-button"]')).toHaveLength(
        0
      );
    });

    test("should not show Resume/Edit Letter button", () => {
      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      expect(wrapper.find('[data-testid="edit-letter-button"]')).toHaveLength(
        0
      );
    });

    test("should not show Review and Approve button", () => {
      const wrapper = mount(
        <Provider store={store}>
          <Router>
            <CaseStatusStepper />
          </Router>
        </Provider>
      );

      const updateStatusButton = wrapper
        .find('[data-testid="update-status-button"]')
        .first();

      expect(updateStatusButton.exists()).toEqual(false);
    });
  });

  describe("getActiveStep", () => {
    test("increments last step value by 1 for map with letter in progress", () => {
      expect(getActiveStep(caseStatusMap, responseBody[5].name)).toEqual(6);
    });

    test("does not increment for statuses other than closed", () => {
      expect(
        getActiveStep(caseStatusMap, responseBody[3].name)
      ).toEqual(3);
    });
  });
});
