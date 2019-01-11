import { shallow } from "enzyme";
import { CaseHistory } from "./CaseHistory";
import React from "react";

describe("CaseHistory", () => {
  test("it fetches the case history and case reference on mount", () => {
    const getCaseHistory = jest.fn();
    const getMinimumCaseDetails = jest.fn();
    shallow(
      <CaseHistory
        getCaseHistory={getCaseHistory}
        getMinimumCaseDetails={getMinimumCaseDetails}
        match={{ params: { id: 5 } }}
      />
    );
    expect(getCaseHistory).toHaveBeenCalledWith(5);
    expect(getMinimumCaseDetails).toHaveBeenCalledWith(5);
  });
});
