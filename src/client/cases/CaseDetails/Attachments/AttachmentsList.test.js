import React from "react";
import Attachment from "../../../testUtilities/attachment";
import { mount } from "enzyme";
import AttachmentsList from "./AttachmentsList";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";

describe("AttachmentsList", () => {
  test("should display attachments in alphabetical order by fileName", () => {
    const attachment1 = new Attachment.Builder()
      .defaultAttachment()
      .withFileName("Z_file.pdf")
      .withId(18)
      .build();

    const attachment2 = new Attachment.Builder()
      .defaultAttachment()
      .withFileName("a_file.pdf")
      .build();

    const attachmentsToDisplay = [attachment1, attachment2];

    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
        <AttachmentsList attachments={attachmentsToDisplay} />
      </Provider>
    );
    const attachmentList = wrapper.find('[data-test="attachmentName"]');

    const actualFileNames = attachmentList.reduce((acc, node) => {
      return acc.add(node.text());
    }, new Set());

    const expectedFileNames = new Set(
      attachmentsToDisplay.map(attachment => attachment.fileName).reverse()
    );

    expect(actualFileNames).toEqual(expectedFileNames);
  });

  test("should show remove attachment dialog with filename when remove button is clicked", () => {
    const attachment1 = new Attachment.Builder()
      .defaultAttachment()
      .withFileName("Z_file.pdf")
      .withId(18)
      .build();

    const attachmentsToDisplay = [attachment1];
    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
        <AttachmentsList attachments={attachmentsToDisplay} />
      </Provider>
    );
    const removeAttachmentButton = wrapper
      .find('[data-test="removeAttachmentButton"]')
      .first();

    removeAttachmentButton.simulate("click");
    wrapper.update();

    expect(
      wrapper
        .find('[data-test="removeAttachmentText"]')
        .first()
        .text()
    ).toEqual("Are you sure you wish to remove Z_file.pdf from this case?");
  });
});
