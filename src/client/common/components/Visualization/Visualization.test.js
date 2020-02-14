import { fireEvent, render } from "@testing-library/react";
import { Visualization } from "./Visualization";
import { QUERY_TYPES } from "../../../../sharedUtilities/constants";
import React from "react";

describe("Visualization", () => {
  function renderVisualizationComponent() {
    return render(
      <Visualization
        queryType={QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE}
      />
    );
  }

  test("should show a pie chat with intake sources in the legend", () => {
    const { container } = renderVisualizationComponent();
    const legendLabels = container.querySelector(".legendtext");
    console.log(legendLabels);
  });
});
