import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import ConnectedTagManagementPage, {
  TagManagementPage
} from "./TagManagementPage";
import createConfiguredStore from "../../createConfiguredStore";
import {
  ASCENDING,
  DESCENDING,
  GET_TAGS_SUCCEEDED
} from "../../../sharedUtilities/constants";

describe("TagManagementPage", () => {
  let store = createConfiguredStore();
  let getTagsWithCount = jest.fn();
  describe("Initial Load", () => {
    beforeEach(() => {
      render(
        <Provider store={store}>
          <Router>
            <TagManagementPage
              getTagsWithCount={getTagsWithCount}
              tags={[]}
              classes={{}}
              loading={false}
              clearTagManagement={jest.fn()}
            />
          </Router>
        </Provider>
      );
    });

    test("should have title Tag Management", () => {
      expect(screen.getByTestId("pageTitle").textContent).toEqual(
        "Tag Management"
      );
    });

    test("should show No Tags Found when there are no tags", () => {
      expect(screen.getByText("No Tags Found")).toBeInTheDocument;
    });

    test("should call getTagsWithCount on mount", () => {
      expect(getTagsWithCount).toBeCalledTimes(1);
    });
  });

  describe("when tags are populated", () => {
    beforeEach(() => {
      render(
        <Provider store={store}>
          <Router>
            <TagManagementPage
              clearTagManagement={jest.fn()}
              getTagsWithCount={getTagsWithCount}
              loading={false}
              tags={[
                { name: "tag with lots of complaints", count: 17, id: 4 },
                { name: "tag with some complaints", count: 5, id: 2 },
                { name: "tag with one complaint", count: 1, id: 3 }
              ]}
              classes={{}}
            />
          </Router>
        </Provider>
      );
    });

    test("should have the appropriate table headers", () => {
      expect(screen.getByText("TAG NAME")).toBeInTheDocument;
      expect(screen.getByText("ASSOCIATED COMPLAINTS")).toBeInTheDocument;
    });

    test("should show the appropriate number of rows", () => {
      expect(screen.getAllByRole("row")).toHaveLength(4); // 1 header row, three body rows
    });

    test("should not call getTagsWithCount", () => {
      expect(getTagsWithCount).toBeCalledTimes(1);
    });

    test("should call getTagsWithCount and update sort order when a header is clicked", async () => {
      userEvent.click(screen.getByTestId("sortTagsByCountHeader"));
      expect(getTagsWithCount.mock.calls[1]).toEqual(["count", ASCENDING]);
      userEvent.click(screen.getByTestId("sortTagsByCountHeader"));
      expect(getTagsWithCount.mock.calls[2]).toEqual(["count", DESCENDING]);
    });

    test("should call getTagsWithCount and update sort order when a header is clicked even if it's a different header", async () => {
      userEvent.click(screen.getByTestId("sortTagsByNameHeader"));
      expect(getTagsWithCount.mock.calls[1]).toEqual(["name", ASCENDING]);
    });
  });

  describe("when using connected component", () => {
    beforeEach(() => {
      render(
        <Provider store={store}>
          <Router>
            <ConnectedTagManagementPage />
          </Router>
        </Provider>
      );
      store.dispatch({
        type: GET_TAGS_SUCCEEDED,
        tags: [
          { name: "tag with lots of complaints", count: 17, id: 4 },
          { name: "tag with some complaints", count: 5, id: 2 },
          { name: "tag with one complaint", count: 1, id: 3 }
        ]
      });
    });

    test("should have the appropriate table headers", async () => {
      expect(await screen.findByText("TAG NAME")).toBeInTheDocument;
      expect(await screen.findByText("ASSOCIATED COMPLAINTS"))
        .toBeInTheDocument;
    });

    test("should show the appropriate number of rows", async () => {
      expect(await screen.findAllByRole("row")).toHaveLength(4); // 1 header row, three body rows
    });
  });

  afterEach(() => {
    getTagsWithCount.mockClear();
  });
});
