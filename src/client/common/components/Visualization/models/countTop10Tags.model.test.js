import CountTop10Tags from "./countTop10Tags.model";
import { COLORS } from "../dataVizStyling";

describe("CountTop10Tags model", () => {
  let model = new CountTop10Tags();
  describe("data transformer", () => {
    test("should transform the rawData from the handler for the visualization component", () => {
      const rawData = [
        {
          name: "karancitoooooo",
          count: "1"
        },
        {
          name: "sabs",
          count: "1"
        },
        {
          name: "Tofu",
          count: "2"
        },
        {
          name: "Chicago hot dogs",
          count: "3"
        }
      ];

      const transformedData = model.transformData(rawData);

      const expectedTransformedData = {
        data: [
          {
            x: ["3"],
            y: ["Chicago hot<br>dogs"],
            type: "bar",
            width: 0.75,
            orientation: "h",
            marker: {
              color: "#002171"
            },
            textposition: "auto",
            textangle: 0
          },
          {
            x: ["2"],
            y: ["Tofu"],
            type: "bar",
            width: 0.75,
            orientation: "h",
            marker: {
              color: "#002171"
            },
            textposition: "auto",
            textangle: 0
          },
          {
            x: ["1"],
            y: ["sabs"],
            type: "bar",
            width: 0.75,
            orientation: "h",
            marker: {
              color: "#002171"
            },
            textposition: "auto",
            textangle: 0
          },
          {
            x: ["1"],
            y: ["karancitoooooo"],
            type: "bar",
            width: 0.75,
            orientation: "h",
            marker: {
              color: "#002171"
            },
            textposition: "auto",
            textangle: 0
          }
        ]
      };

      expect(transformedData).toEqual(expectedTransformedData);
    });

    test("should wrap the text of long values on y-axis", () => {
      const rawData = [
        {
          name: "Chicago deep dish pizza",
          count: "1"
        }
      ];

      const transformedData = model.transformData(rawData);

      const expectedTransformedData = {
        data: [
          {
            x: ["1"],
            y: ["Chicago deep<br>dish pizza"],
            type: "bar",
            width: 0.75,
            orientation: "h",
            marker: {
              color: "#002171"
            },
            textposition: "auto",
            textangle: 0
          }
        ]
      };

      expect(transformedData).toEqual(expectedTransformedData);
    });

    test("should handle layout when no data is returned from backend", () => {
      const rawData = [];

      const transformedData = model.transformData(rawData);

      const expectedTransformedData = {
        data: [
          {
            x: [],
            y: [],
            type: "bar",
            width: 0.75,
            orientation: "h",
            marker: {
              color: COLORS[0]
            },
            textposition: "auto",
            textangle: 0
          }
        ]
      };

      expect(transformedData).toEqual(expectedTransformedData);
    });
  });
});
