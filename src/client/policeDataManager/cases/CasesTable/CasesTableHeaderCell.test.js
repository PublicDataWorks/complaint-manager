import React from "react";
import { render, screen } from "@testing-library/react";
import CasesTableHeaderCell from "./CasesTableHeaderCell";

describe("CasesTableHeaderCell", () => {
  test("should render the text", () => {
    render(
      <CasesTableHeaderCell
        active={false}
        className="tableCell"
        onClick={jest.fn()}
        sortDirection="desc"
        width="10%"
      >
        HEADER TEXT
      </CasesTableHeaderCell>
    );
    expect(screen.getByText("HEADER TEXT")).toBeInTheDocument;
  });
});
