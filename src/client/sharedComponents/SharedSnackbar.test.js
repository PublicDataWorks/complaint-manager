import React from "react";
import { mount } from "enzyme/build/index";
import SharedSnackbar from "./SharedSnackbar";
import { expectEventuallyNotToExist } from "../../testHelpers";

describe("SharedSnackbar", () => {
  test("should not be visible initially", () => {
    const sharedSnackbar = mount(
      <SharedSnackbar open={false} creationSuccess={false} message={""} />
    );

    const resultMessage = sharedSnackbar.find(
      '[data-test="sharedSnackbarBannerText"]'
    );
    expect(resultMessage.exists()).toEqual(false);
  });

  test("should be visible with success message after successful creation", () => {
    const sharedSnackbar = mount(
      <SharedSnackbar open={false} creationSuccess={false} message={""} />
    );
    sharedSnackbar.setProps({
      open: true,
      creationSuccess: true,
      message: "successfully created."
    });

    const resultMessage = sharedSnackbar.find(
      'span[data-test="sharedSnackbarBannerText"]'
    );

    expect(resultMessage.text()).toEqual("successfully created.");
  });

  test("should be not visible after dismissed", async () => {
    const sharedSnackbar = mount(
      <SharedSnackbar
        open={true}
        creationSuccess={true}
        message={"successfully created."}
      />
    );

    sharedSnackbar.setProps({ open: false });

    await expectEventuallyNotToExist(
      sharedSnackbar,
      '[data-test="sharedSnackbarBannerText"]'
    );
  });
});
