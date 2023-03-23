import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mount } from "enzyme";
import Accused from "./Accused";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Officer from "../../../../../sharedTestHelpers/Officer";
import CaseOfficer from "../../../../../sharedTestHelpers/caseOfficer";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import { USER_PERMISSIONS } from "../../../../../sharedUtilities/constants";

describe("Accused", function () {
  let dispatchSpy;
  test("should display officers", () => {
    const anOfficer = new Officer.Builder()
      .defaultOfficer()
      .withFullName("Jerry Springfield")
      .build();
    const accusedOfficers = [
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withOfficerAttributes(anOfficer)
        .build()
    ];

    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
        <Accused accusedOfficers={accusedOfficers} />
      </Provider>
    );

    const officersDisplayed = wrapper.find('[data-testid="knownOfficerPanel"]');
    const firstOfficer = officersDisplayed.first();

    expect(firstOfficer.text()).toContain(anOfficer.fullName);
  });

  test("should display unknown officers", () => {
    const accusedOfficers = [
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withUnknownOfficer()
        .withFullName("Unknown Officer")
        .build()
    ];

    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
        <Accused accusedOfficers={accusedOfficers} />
      </Provider>
    );

    const officersDisplayed = wrapper.find(
      '[data-testid="unknownOfficerPanel"]'
    );
    const firstOfficer = officersDisplayed.first();

    expect(firstOfficer.text()).toContain("Unknown Officer");
  });

  test("should not display add and manage buttons without edit case permission", () => {
    const store = createConfiguredStore();
    store.dispatch({
      type: "AUTH_SUCCESS",
      userInfo: { permissions: [USER_PERMISSIONS.ADD_TAG_TO_CASE] }
    });
    const anOfficer = new Officer.Builder()
      .defaultOfficer()
      .withFullName("Jerry Springfield")
      .build();
    const accusedOfficers = [
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withOfficerAttributes(anOfficer)
        .build()
    ];

    const wrapper = mount(
      <Provider store={store}>
        <Accused accusedOfficers={accusedOfficers} />
      </Provider>
    );

    expect(wrapper.text()).not.toContain("+ Add Accused");
    expect(wrapper.text()).not.toContain("Manage");
  });

  test("should display add and manage buttons with edit case permission", () => {
    const store = createConfiguredStore();
    store.dispatch({
      type: "AUTH_SUCCESS",
      userInfo: { permissions: [USER_PERMISSIONS.EDIT_CASE] }
    });
    const anOfficer = new Officer.Builder()
      .defaultOfficer()
      .withFullName("Jerry Springfield")
      .build();
    const accusedOfficers = [
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withOfficerAttributes(anOfficer)
        .build()
    ];

    const wrapper = mount(
      <Provider store={store}>
        <Accused accusedOfficers={accusedOfficers} />
      </Provider>
    );

    expect(wrapper.text()).toContain("+ Add Accused");
    expect(wrapper.text()).toContain("Manage");
  });

  test("should render complainantwitnessmenu when click add accused button", async () => {
    const store = createConfiguredStore();
    store.dispatch({
      type: "AUTH_SUCCESS",
      userInfo: { permissions: [USER_PERMISSIONS.EDIT_CASE] }
    });
    dispatchSpy = jest.spyOn(store, "dispatch");
    const anOfficer = new Officer.Builder()
      .defaultOfficer()
      .withFullName("Jerry Springfield")
      .build();
    const accusedOfficers = [
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withOfficerAttributes(anOfficer)
        .build()
    ];

    render(
      <Provider store={store}>
        <Router>
          <Accused accusedOfficers={accusedOfficers} />
        </Router>
      </Provider>
    );

    userEvent.click(screen.getByText("+ Add Accused"));
    expect(await screen.findByTestId("editDialogTitle")).toBeInTheDocument;
  });
});
