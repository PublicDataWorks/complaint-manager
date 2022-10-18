import React from "react";
import { render, screen } from "@testing-library/react";
import Collapser from "./Collapser";
import userEvent from "@testing-library/user-event";

describe("Collapser", () => {
  beforeEach(() => {
    render(
      <Collapser name="Stuff">
        <div>Should I see this?</div>
      </Collapser>
    );
  });

  test("should show the text 'Show Stuff' before being clicked", () => {
    expect(screen.getByText("Show Stuff")).toBeInTheDocument;
    expect(screen.queryAllByText("Should I see this?")).toHaveLength(0);
  });

  test("should show the text 'Hide Stuff' and also 'Should I see this?' after being clicked", () => {
    userEvent.click(screen.getByText("Show Stuff"));
    expect(screen.getByText("Hide Stuff")).toBeInTheDocument;
    expect(screen.getByText("Should I see this?")).toBeInTheDocument;
  });

  test("should show text 'Show Stuff' and hide Should I see this?' after being clicked twice", () => {
    userEvent.click(screen.getByText("Show Stuff"));
    userEvent.click(screen.getByText("Hide Stuff"));
    expect(screen.getByText("Show Stuff")).toBeInTheDocument;
    expect(screen.queryAllByText("Should I see this?")).toHaveLength(0);
  });
});
