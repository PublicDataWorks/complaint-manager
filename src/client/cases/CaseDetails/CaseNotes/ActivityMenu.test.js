import React from "react";
import { mount } from "enzyme";
import ActivityMenu from "./ActivityMenu";
import { Backdrop, Menu } from "@material-ui/core";
import createConfiguredStore from "../../../createConfiguredStore";
import {
  openCaseNoteDialog,
  openRemoveCaseNoteDialog
} from "../../../actionCreators/casesActionCreators";
import { Provider } from "react-redux";
import moment from "moment";
import { initialize } from "redux-form";

describe("ActivityMenu", () => {
  let wrapper, activityMenuButton, dispatchSpy, caseId, activity;

  beforeEach(() => {
    const store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    caseId = 1;
    activity = {
      id: 1,
      actionTakenAt: moment()
    };
    wrapper = mount(
      <Provider store={store}>
        <ActivityMenu caseId={caseId} activity={activity} />
      </Provider>
    );

    activityMenuButton = wrapper
      .find('[data-test="activityMenuButton"]')
      .last();
  });

  test("should contain kebab icon", () => {
    expect(activityMenuButton.exists()).toEqual(true);
  });

  test("should open menu when icon clicked", () => {
    activityMenuButton.simulate("click");
    const activityMenu = wrapper.find(Menu);

    expect(activityMenu.props().open).toEqual(true);
  });

  test("should close when clicking outside", () => {
    activityMenuButton.simulate("click");
    const background = wrapper.find(Backdrop);
    background.simulate("click");
    const activityMenu = wrapper.find(Menu);

    expect(activityMenu.props().open).toEqual(false);
  });

  test("should open edit note dialog and close menu when edit note button clicked", () => {
    activityMenuButton.simulate("click");
    const editMenuItem = wrapper.find('[data-test="editMenuItem"]').last();
    editMenuItem.simulate("click");
    const activityMenu = wrapper.find(Menu);

    const valuesToInitialize = {
      ...activity,
      actionTakenAt: moment(activity.actionTakenAt).format(
        "YYYY-MM-DDTHH:mm:ss"
      )
    };

    expect(dispatchSpy).toHaveBeenCalledWith(
      initialize("CaseNotes", valuesToInitialize)
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      openCaseNoteDialog("Edit", activity)
    );
    expect(activityMenu.props().open).toEqual(false);
  });

  test("should open remove note dialog and close menu when remove note button clicked", () => {
    activityMenuButton.simulate("click");
    const removeMenuItem = wrapper.find('[data-test="removeMenuItem"]').last();
    removeMenuItem.simulate("click");
    const activityMenu = wrapper.find(Menu);

    expect(dispatchSpy).toHaveBeenCalledWith(
      openRemoveCaseNoteDialog(activity)
    );
    expect(activityMenu.props().open).toEqual(false);
  });
});
