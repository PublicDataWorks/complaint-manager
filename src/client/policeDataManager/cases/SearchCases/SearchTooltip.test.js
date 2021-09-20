import React from "react";
import { render, screen } from "@testing-library/react";
import SearchTooltip from "./SearchTooltip";

describe("SearchTooltip", () => {
  beforeEach(() => {
    render(
      <SearchTooltip
        tooltipButton={{
          clientHeight: 5,
          getBoundingClientRect: () => ({})
        }}
      />
    );
  });

  test("should display the agreed upon content", () => {
    expect(screen.getByText("Advanced Search")).toBeInTheDocument;
    expect(screen.getByText("Search Terms")).toBeInTheDocument;
    expect(
      screen.getByText(
        "Search terms must be followed by a colon and use quotes for search terms containing spaces, dashes, etc."
      )
    ).toBeInTheDocument;
    expect(screen.getByText("Search Operators")).toBeInTheDocument;
    expect(screen.getByText("Parentheses and Quotes")).toBeInTheDocument;
    expect(
      screen.getByText(
        "Use parentheses to group your search terms and quotes to search for exact matches."
      )
    ).toBeInTheDocument;
  });
});
