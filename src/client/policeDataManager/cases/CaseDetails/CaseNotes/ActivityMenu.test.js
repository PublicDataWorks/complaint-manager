import React from "react";
import { mount } from "enzyme";
import ActivityMenu from "./ActivityMenu";
import { Menu } from "@material-ui/core";
import createConfiguredStore from "../../../../createConfiguredStore";
import {
  openCaseNoteDialog,
  openRemoveCaseNoteDialog
} from "../../../actionCreators/casesActionCreators";
import { Provider } from "react-redux";
import moment from "moment";
import { initialize } from "redux-form";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";
import { userAuthSuccess } from "../../../../common/auth/actionCreators";

describe("ActivityMenu", () => {
  const currentUserEmail = "owner.author@productive.org";
  let wrapper,
    activityMenuButton,
    menuButtonPadding,
    dispatchSpy,
    caseId,
    activity,
    store;

  beforeEach(() => {
    store = createConfiguredStore();
    store.dispatch(
      userAuthSuccess({
        nickname: currentUserEmail
      })
    );
    dispatchSpy = jest.spyOn(store, "dispatch");
    caseId = 1;
    activity = {
      id: 1,
      actionTakenAt: moment(),
      author: { name: "tuser", email: currentUserEmail }
    };
    wrapper = mount(
      <Provider store={store}>
        <ActivityMenu caseId={caseId} activity={activity} />
      </Provider>
    );

    activityMenuButton = wrapper
      .find('[data-testid="activityMenuButton"]')
      .last();
    menuButtonPadding = wrapper
      .find('[data-testid="menuButtonPadding"]')
      .last();
  });

  test("should contain kebab icon when activity user is current logged in user", () => {
    expect(activityMenuButton.exists()).toEqual(true);
    expect(menuButtonPadding.exists()).toEqual(false);
  });

  test("should NOT contain kebab icon when activity user is NOT current logged in user", () => {
    store.dispatch(
      userAuthSuccess({
        nickname: "i.delete.notes@productive.org"
      })
    );
    wrapper.update();
    activityMenuButton = wrapper
      .find('[data-testid="activityMenuButton"]')
      .last();
    menuButtonPadding = wrapper
      .find('[data-testid="menuButtonPadding"]')
      .last();

    expect(activityMenuButton.exists()).toEqual(false);
    expect(menuButtonPadding.exists()).toEqual(true);
  });

  test("should open menu when icon clicked", () => {
    activityMenuButton.simulate("click");
    const activityMenu = wrapper.find(Menu);

    expect(activityMenu.props().open).toEqual(true);
  });

  test("should close when clicking outside", () => {
    activityMenuButton.simulate("click");
    const background = wrapper.find("ForwardRef(SimpleBackdrop)");
    background.simulate("click");
    const activityMenu = wrapper.find(Menu);

    expect(activityMenu.props().open).toEqual(false);
  });

  test("should open edit note dialog and close menu when edit note button clicked", () => {
    activityMenuButton.simulate("click");
    const editMenuItem = wrapper.find('[data-testid="editMenuItem"]').last();
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
    expect(
      wrapper.find('[data-testid="caseNoteDialogTitle"]').exists()
    ).toBeTrue();

    expect(activityMenu.props().open).toEqual(false);
  });

  describe("when removeCaseNotes feature is disabled", () => {
    test("does NOT display option to remove case note", () => {
      store.dispatch(
        getFeaturesSuccess({
          removeCaseNotes: false
        })
      );
      wrapper.update();

      activityMenuButton.simulate("click");

      expect(
        wrapper.find('[data-testid="removeMenuItem"]').exists()
      ).toBeFalse();
    });
  });

  describe("when removeCaseNotesFeature is enabled", () => {
    test("should open remove note dialog and close menu when remove note button clicked", () => {
      store.dispatch(
        getFeaturesSuccess({
          removeCaseNotesFeature: true
        })
      );
      wrapper.update();

      activityMenuButton.simulate("click");
      const removeMenuItem = wrapper
        .find('[data-testid="removeMenuItem"]')
        .last();
      removeMenuItem.simulate("click");
      const activityMenu = wrapper.find(Menu);

      expect(dispatchSpy).toHaveBeenCalledWith(
        openRemoveCaseNoteDialog(activity)
      );
      expect(activityMenu.props().open).toEqual(false);
    });
  });
});
