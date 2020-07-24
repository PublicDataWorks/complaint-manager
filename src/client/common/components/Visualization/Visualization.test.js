import { QUERY_TYPES } from "../../../../sharedUtilities/constants";
import { PlotlyWrapper } from "./PlotlyWrapper";
import React from "react";
import { act, render } from "@testing-library/react";
import Visualization from "./Visualization";
import axios from "axios";
import {
  COLORS,
  generateDonutCenterAnnotations,
  LABEL_FONT,
  TITLE_FONT
} from "./dataVizStyling";

jest.mock("./PlotlyWrapper", () => {
  const FakeWrapper = jest.fn(() => "PlotlyWrapper");
  return { PlotlyWrapper: FakeWrapper };
});

jest.mock("axios");

describe("Visualization", () => {
  test("should pass correct data and layout options to PlotlyWrapper for countComplaintsByComplainantTypePast12Months", async () => {
    // Arrange
    const responseBody = {
      data: {
        CC: [
          {
            date: "Jun 19",
            count: 1
          }
        ],
        PO: [
          {
            date: "Jun 19",
            count: 8
          }
        ],
        CN: [
          {
            date: "Jun 19",
            count: 3
          }
        ],
        AC: [
          {
            date: "Jun 19",
            count: 0
          }
        ]
      }
    };

    axios.get.mockResolvedValue({ ...responseBody });

    // Act
    await act(async () => {
      render(
        <Visualization
          queryType={
            QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE_PAST_12_MONTHS
          }
        />
      );
    });

    //Assert
    expect(PlotlyWrapper).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            x: ["Jun 19"],
            y: [1],
            name: "Civilian (CC)",
            marker: {
              color: COLORS[0]
            },
            hoverinfo: "y+name",
            legendgroup: "groupCC"
          }),
          expect.objectContaining({
            x: ["Jun 19", "Jun 19"],
            y: [1.225, 0.775],
            fillcolor: "rgba(0,33,113,0.2)",
            hoverinfo: "none",
            fill: "tozerox",
            line: { color: "transparent" },
            name: "CC",
            showlegend: false,
            legendgroup: "groupCC"
          }),
          expect.objectContaining({
            x: ["Jun 19"],
            y: [8],
            name: "Police Officer (PO)",
            marker: {
              color: COLORS[1]
            },
            hoverinfo: "y+name",
            legendgroup: "groupPO"
          }),
          expect.objectContaining({
            x: ["Jun 19", "Jun 19"],
            y: [8.225, 7.775],
            fillcolor: "rgba(95,173,86,0.3)",
            hoverinfo: "none",
            fill: "tozerox",
            line: { color: "transparent" },
            name: "PO",
            showlegend: false,
            legendgroup: "groupPO"
          }),
          expect.objectContaining({
            x: ["Jun 19"],
            y: [3],
            name: "Civilian NOPD Employee (CN)",
            marker: {
              color: COLORS[2]
            },
            hoverinfo: "y+name",
            legendgroup: "groupCN"
          }),
          expect.objectContaining({
            x: ["Jun 19", "Jun 19"],
            y: [3.225, 2.775],
            fillcolor: "rgba(157,93,155,0.3)",
            hoverinfo: "none",
            fill: "tozerox",
            line: { color: "transparent" },
            name: "CN",
            showlegend: false,
            legendgroup: "groupCN"
          }),
          expect.objectContaining({
            x: ["Jun 19"],
            y: [0],
            name: "Anonymous (AC)",
            marker: {
              color: COLORS[5]
            },
            hoverinfo: "y+name",
            legendgroup: "groupAC"
          }),
          expect.objectContaining({
            x: ["Jun 19", "Jun 19"],
            y: [0.225, -0.225],
            fillcolor: "rgba(230, 159, 1,0.3)",
            hoverinfo: "none",
            fill: "tozerox",
            line: { color: "transparent" },
            name: "AC",
            showlegend: false,
            legendgroup: "groupAC"
          })
        ]),
        layout: expect.objectContaining({
          barmode: "group",
          yaxis: { range: [0, 9] },
          font: {
            family: "Open Sans",
            color: "#A9A9A9",
            size: 14
          },
          title: {
            text: "Complainant Type over Past 12 Months",
            font: TITLE_FONT
          }
        })
      }),
      {}
    );
  });

  test("should pass correct data and layout options to PlotlyWrapper for countComplaintsByComplainantType", async () => {
    // Arrange
    const responseBody = {
      data: {
        CC: 1,
        PO: 0,
        CN: 1,
        AC: 2
      }
    };

    axios.get.mockResolvedValue({ ...responseBody });

    // Act
    await act(async () => {
      render(
        <Visualization
          queryType={QUERY_TYPES.COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE}
        />
      );
    });

    // Assert
    expect(PlotlyWrapper).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            labels: expect.arrayContaining([
              "Civilian (CC)",
              "Civilian NOPD Employee (CN)",
              "Anonymous (AC)"
            ]),
            type: "pie",
            values: expect.arrayContaining([1, 1, 2]),
            marker: {
              colors: COLORS
            },
            hoverinfo: "label+percent",
            textinfo: "label+value",
            textposition: "outside",
            hole: 0.5
          })
        ]),
        layout: expect.objectContaining({
          title: {
            text: "Complaints by Complainant Type",
            font: TITLE_FONT
          },
          height: 600,
          width: 800,
          margin: {
            b: 170
          },
          annotations: generateDonutCenterAnnotations(4),
          showlegend: false,
          font: LABEL_FONT
        })
      }),
      {}
    );
  });

  test("should pass correct data and layout options to PlotlyWrapper for countComplaintsByIntakeSource", async () => {
    // Arrange
    const responseBody = {
      data: [
        { cases: "2", name: "Email" },
        { cases: "5", name: "Facebook" },
        { cases: "3", name: "Other" }
      ]
    };

    axios.get.mockResolvedValue({ ...responseBody });

    // Act
    await act(async () => {
      render(
        <Visualization
          queryType={QUERY_TYPES.COUNT_COMPLAINTS_BY_INTAKE_SOURCE}
        />
      );
    });

    // Assert
    expect(PlotlyWrapper).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.arrayContaining([
          expect.objectContaining({
            labels: expect.arrayContaining(["Email", "Facebook", "Other"]),
            type: "pie",
            values: expect.arrayContaining([2, 5, 3]),
            marker: {
              colors: COLORS
            },
            hoverinfo: "label+percent",
            textinfo: "label+value",
            textposition: "outside",
            hole: 0.5
          })
        ]),
        layout: expect.objectContaining({
          title: {
            text: "Complaints by Intake Source",
            font: TITLE_FONT
          },
          height: 600,
          width: 800,
          margin: {
            b: 170
          },
          annotations: generateDonutCenterAnnotations(10),
          showlegend: false,
          font: LABEL_FONT
        })
      }),
      {}
    );
  });
});
