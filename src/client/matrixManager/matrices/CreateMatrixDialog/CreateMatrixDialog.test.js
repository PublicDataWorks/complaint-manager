import createConfiguredStore from "../../../createConfiguredStore";
import { mount } from "enzyme/build/index";
import { Provider } from "react-redux";
import React from "react";
import CreateMatrixButton from "../MatrixList/CreateMatrixButton";
import {
  changeInput,
  expectEventuallyNotToExist,
  findDropdownOption
} from "../../../testHelpers";
import { getUsersSuccess } from "../../../complaintManager/actionCreators/shared/usersActionCreators";
import createMatrix from "../thunks/createMatrix";

jest.mock("../thunks/createMatrix", () => creationDetails => ({
  type: "MOCK_CREATE_MATRIX_THUNK",
  creationDetails
}));

describe("CreateMatrixDialog", () => {
  let store, wrapper, dispatchSpy, users;

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

    users = [
      {
        name: "Jacob",
        email: "jacob@me.com"
      },
      {
        name: "Kuba",
        email: "kuba@me.com"
      }
    ];
    store.dispatch(getUsersSuccess(users));
    wrapper.update();
  });

  test("should dismiss when cancel button is clicked", async () => {
    const cancel = wrapper.find('button[data-test="cancel-matrix"]');
    cancel.simulate("click");

    await expectEventuallyNotToExist(
      wrapper,
      '[data-test="create-matrix-dialog-title"]'
    );
  });

  describe("Create and Search Button", () => {
    beforeEach(() => {
      changeInput(wrapper, '[data-test="pib-control-input"]', "2019-0001-Y");
      findDropdownOption(
        wrapper,
        '[data-test="first-reviewer-dropdown"]',
        "Jacob",
        false
      );
      findDropdownOption(
        wrapper,
        '[data-test="second-reviewer-dropdown"]',
        "Kuba",
        false
      );
    });

    test("should call the thunk with correct values", () => {
      dispatchSpy.mockClear();
      const submitButton = wrapper.find(
        'PrimaryButton[data-test="create-and-search"]'
      );

      submitButton.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(
        createMatrix({
          pibControlNumber: "2019-0001-Y",
          firstReviewer: "jacob@me.com",
          secondReviewer: "kuba@me.com"
        })
      );
    });
  });

  describe("reviewer dropdown", () => {
    test("should load getUsers output in dropdown", () => {
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
