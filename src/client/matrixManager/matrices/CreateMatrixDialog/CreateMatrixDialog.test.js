import createConfiguredStore from "../../../createConfiguredStore";
import { mount } from "enzyme/build/index";
import { Provider } from "react-redux";
import React from "react";
import CreateMatrixButton from "../MatrixList/CreateMatrixButton";
import { expectEventuallyNotToExist } from "../../../testHelpers";
import { getUsersSuccess } from "../../../actionCreators/shared/usersActionCreators";

describe("CreateMatrixDialog", () => {
  let store, wrapper, dispatchSpy;

  beforeEach(() => {
    store = createConfiguredStore();

    dispatchSpy = jest.spyOn(store, "dispatch");

    wrapper = mount(
      <Provider store={store}>
        <CreateMatrixButton />
      </Provider>
    );

    dispatchSpy.mockClear();

    const createMatrixDialog = wrapper.find(
      'button[data-test="create-matrix-button"]'
    );
    createMatrixDialog.simulate("click");
  });

  test("should dismiss when cancel button is clicked", async () => {
    const cancel = wrapper.find('button[data-test="cancel-matrix"]');
    cancel.simulate("click");

    await expectEventuallyNotToExist(
      wrapper,
      '[data-test="create-matrix-dialog-title"]'
    );
  });

  describe("reviewer dropdown", () => {
    let users = [
      {
        name: "Jacob",
        email: "jacob@me.com"
      },
      {
        name: "Kuba",
        email: "kuba@me.com"
      }
    ];
    test("should load getUsers output in dropdown", () => {
      store.dispatch(getUsersSuccess(users));
      wrapper.update();

      let firstReviewer = wrapper
        .find('[data-test="first-reviewer-dropdown"]')
        .first();

      expect(firstReviewer.prop("children")).toEqual(
        expect.toIncludeSameMembers([
          expect.objectContaining({
            label: "",
            value: ""
          }),
          expect.objectContaining({
            label: "Jacob",
            value: "jacob@me.com"
          }),
          expect.objectContaining({
            label: "Kuba",
            value: "kuba@me.com"
          })
        ])
      );

      // Cloning the users array
      const newUsers = users.slice(0);
      newUsers.push({
        name: "new guy",
        email: "whatsup@newguy.me"
      });
      store.dispatch(getUsersSuccess(newUsers));
      wrapper.update();

      firstReviewer = wrapper
        .find('[data-test="first-reviewer-dropdown"]')
        .first();

      expect(firstReviewer.prop("children")).toEqual(
        expect.toIncludeSameMembers([
          expect.objectContaining({
            label: "",
            value: ""
          }),
          expect.objectContaining({
            label: "Jacob",
            value: "jacob@me.com"
          }),
          expect.objectContaining({
            label: "Kuba",
            value: "kuba@me.com"
          }),
          expect.objectContaining({
            label: "new guy",
            value: "whatsup@newguy.me"
          })
        ])
      );
    });
  });
});
