import { shallow } from "enzyme/build/index";
import React from "react";
import { AllegationSearchResults } from "./AllegationSearchResults";
import getSearchResults from "../shared/thunks/getSearchResults";

jest.mock("../shared/thunks/getSearchResults");

describe("AllegationSearchResults", function() {
  let allegationSearchResults;
  beforeEach(() => {
    const props = {
      form: {
        AllegationSearchForm: {
          values: []
        }
      }
    };

    allegationSearchResults = shallow(
      <AllegationSearchResults dispatch={jest.fn()} {...props} />
    ).instance();
  });

  describe("onChange", function() {
    test("should make api call to allegations search", () => {
      allegationSearchResults.onChange(12, 1);

      expect(getSearchResults).toHaveBeenCalled();
    });

    test("should paginate search", function() {
      allegationSearchResults.onChange(12, 1);

      expect(getSearchResults.mock.calls[0][2]).toBeTruthy();
    });
  });
});
