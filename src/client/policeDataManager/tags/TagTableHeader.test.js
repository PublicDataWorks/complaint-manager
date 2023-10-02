import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TagTableHeader from "./TagTableHeader";
import "@testing-library/jest-dom";

describe("TagTableHeader", () => {
  let changeSort = jest.fn();
  beforeEach(() => {
    render(
      <table>
        <tbody>
          <tr>
            <TagTableHeader
              active={false}
              changeSort={changeSort}
              classes={{ cell: "hi" }}
              value="howdy"
            >
              Hello
            </TagTableHeader>
          </tr>
        </tbody>
      </table>
    );
  });

  test("should render children as text", () => {
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  test("should call changeSort with argument key when clicked", () => {
    userEvent.click(screen.getByText("Hello"));
    expect(changeSort.mock.calls[0]).toEqual(["howdy"]);
  });
});
