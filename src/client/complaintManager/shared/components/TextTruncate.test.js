import React from "react";
import { mount } from "enzyme/build/index";
import TextTruncate from "./TextTruncate";
import ActivityDisplay from "../../cases/CaseDetails/CaseNotes/ActivityDisplay";

jest.mock("../../cases/CaseDetails/CaseNotes/ActivityDisplay", () => ({
  getActivityNotes: jest.fn()
}));

describe("TextTruncate", () => {
  function getStringOfLength(length) {
    return new Array(length + 1).join("x");
  }

  test("should not display show more/less button if message is less than or equal to 400 characters", () => {
    let message = getStringOfLength(400);
    const textTruncate = mount(
      <TextTruncate message={message} testLabel={"untruncatedMessage"} />
    );

    const showMoreButton = textTruncate.find("button");
    expect(showMoreButton.exists()).toBeFalsy();

    const displayedMessage = textTruncate
      .find('[data-testid="untruncatedMessage"]')
      .last();
    expect(displayedMessage.text()).toEqual(message);
  });

  test("should allow numbers as messages", () => {
    const textTruncate = mount(
      <TextTruncate message={422} testLabel={"numericMessage"} />
    );

    const showMoreButton = textTruncate.find("button");
    expect(showMoreButton.exists()).toBeFalsy();

    const displayedMessage = textTruncate
      .find('[data-testid="numericMessage"]')
      .last();
    expect(displayedMessage.text()).toEqual("422");
  });

  test("should show 'show more' option and append '...' if > 400 characters", () => {
    const textTruncate = mount(
      <TextTruncate
        message={getStringOfLength(401)}
        testLabel={"truncatedMessage"}
      />
    );

    const expectedDisplay = getStringOfLength(400) + "...";
    const displayedMessage = textTruncate
      .find('[data-testid="truncatedMessage"]')
      .last();

    const displayedButton = textTruncate.find("button").last();

    expect(displayedMessage.text()).toEqual(expectedDisplay);
    expect(displayedButton.text()).toEqual("(show more)");
  });

  test("should expand on 'show more' selection", () => {
    const fullMessage = getStringOfLength(401);
    const textTruncate = mount(
      <TextTruncate message={fullMessage} testLabel={"truncatedMessage"} />
    );

    const showMoreButton = textTruncate.find("button");
    showMoreButton.simulate("click");

    const displayedMessage = textTruncate
      .find('[data-testid="truncatedMessage"]')
      .last();

    const showLessButton = textTruncate.find("button").last();

    expect(displayedMessage.text()).toEqual(fullMessage);
    expect(showLessButton.text()).toEqual("(show less)");
  });

  test("should collapse on 'show less' selection", () => {
    const textTruncate = mount(
      <TextTruncate
        message={getStringOfLength(401)}
        testLabel={"truncatedMessage"}
      />
    );

    textTruncate.find("button").simulate("click");
    textTruncate.find("button").simulate("click");

    const expectedDisplay = getStringOfLength(400) + "...";

    const displayedMessage = textTruncate
      .find('[data-testid="truncatedMessage"]')
      .last();

    const showMoreButton = textTruncate.find("button").last();

    expect(displayedMessage.text()).toEqual(expectedDisplay);
    expect(showMoreButton.text()).toEqual("(show more)");
  });

  test("should display show more/less button when there are 2+ newlines", () => {
    let message = "asdf\n\n\nasdf";
    const textTruncate = mount(
      <TextTruncate message={message} testLabel={"untruncatedMessage"} />
    );

    const showMoreButton = textTruncate.find("button");
    expect(showMoreButton.exists());

    const displayedMessage = textTruncate
      .find('[data-testid="untruncatedMessage"]')
      .last();

    expect(displayedMessage.text()).toEqual("asdf...");
    expect(showMoreButton.text()).toEqual("(show more)");
  });

  test("should display show more button after 400 characters but before newlines", () => {
    let message = getStringOfLength(402) + "\n\nasdf";
    const textTruncate = mount(
      <TextTruncate message={message} testLabel={"untruncatedMessage"} />
    );

    const showMoreButton = textTruncate.find("button");
    expect(showMoreButton.exists());

    const displayedMessage = textTruncate
      .find('[data-testid="untruncatedMessage"]')
      .last();

    expect(displayedMessage.text()).toEqual(getStringOfLength(400) + "...");
    expect(showMoreButton.text()).toEqual("(show more)");
  });

  test("should display show more button after line breaks with over 400 characters and line breaks at beginning", () => {
    let message = "\n\n" + getStringOfLength(400);
    const textTruncate = mount(
      <TextTruncate message={message} testLabel={"untruncatedMessage"} />
    );

    const showMoreButton = textTruncate.find("button");
    expect(showMoreButton.exists());

    const displayedMessage = textTruncate
      .find('[data-testid="untruncatedMessage"]')
      .last();

    expect(displayedMessage.text()).toEqual("...");
    expect(showMoreButton.text()).toEqual("(show more)");
  });

  test("should display show more button after line breaks with less than 400 chars", () => {
    let message = "\n\nhello";
    const textTruncate = mount(
      <TextTruncate message={message} testLabel={"untruncatedMessage"} />
    );

    const showMoreButton = textTruncate.find("button");
    expect(showMoreButton.exists());

    const displayedMessage = textTruncate
      .find('[data-testid="untruncatedMessage"]')
      .last();

    expect(displayedMessage.text()).toEqual("...");
    expect(showMoreButton.text()).toEqual("(show more)");
  });

  test("should call getActivityNotes when truncating case note", () => {
    const textTruncate = mount(
      <TextTruncate
        message={getStringOfLength(401) + "@Tim Burton"}
        testLabel={"truncatedMessage"}
        getActivityNotes={ActivityDisplay.getActivityNotes}
      />
    );

    expect(textTruncate.props().getActivityNotes).toHaveBeenCalled();
  });
});
