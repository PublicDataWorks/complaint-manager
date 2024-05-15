import CountTop10Allegations from "./countTop10Allegations.model";
import { COLORS } from "../dataVizStyling";

describe("CountTop10Allegations model", () => {
  let model = new CountTop10Allegations();
  describe("data transformer", () => {
    test("should transform the rawData from the handler for the visualization component", () => {
      const rawData = [
        {
          rule: "Rule 1",
          directive: "Professionalism",
          paragraph: "description for Professionalism",
          count: "1"
        },
        {
          rule: "Rule 2",
          directive: "Unauthorized Force",
          paragraph: "description for Unauthorized Force",
          count: "1"
        },
        {
          rule: "Rule 3",
          directive: "Workplace",
          paragraph: "description for Workplace",
          count: "2"
        },
        {
          rule: "Rule 4",
          directive: "Arrest",
          paragraph: "description for Arrest",
          count: "3"
        }
      ];

      const transformedData = model.transformData(rawData);

      const expectedTransformedData = {
        data: [
          {
            x: [ '3' ],
            y: [ 'Arrest' ],
            type: 'bar',
            width: 0.75,
            orientation: 'h',
            marker: { color: '#002171' },
            textposition: 'auto',
            textangle: 0
          },
          {
            x: [ '2' ],
            y: [ 'Workplace' ],
            type: 'bar',
            width: 0.75,
            orientation: 'h',
            marker: { color: '#002171' },
            textposition: 'auto',
            textangle: 0
          },
          {
            x: [ '1' ],
            y: [ 'Unauthorized Use of Force' ],
            type: 'bar',
            width: 0.75,
            orientation: 'h',
            marker: { color: '#002171' },
            textposition: 'auto',
            textangle: 0
          },
          {
            x: [ '1' ],
            y: [ 'Professionalism' ],
            type: 'bar',
            width: 0.75,
            orientation: 'h',
            marker: { color: '#002171' },
            textposition: 'auto',
            textangle: 0
          }
        ]
      };

      expect(transformedData).toEqual(expectedTransformedData);
    });

    test("should display the paragraph in the y value (with truncation) if no directive is provided", () => {
      const rawData = [
        {
          rule: "Rule 1",
          paragraph: "description for Professionalism",
          count: "1"
        },
        {
          rule: "Rule 2",
          directive: "Unauthorized Force",
          paragraph: "description for Unauthorized Force",
          count: "1"
        },
        {
          rule: "Rule 3",
          directive: "Workplace",
          paragraph: "description for Workplace",
          count: "2"
        },
        {
          rule: "Rule 4",
          paragraph: "description for Arrest",
          count: "3"
        }
      ];

      const transformedData = model.transformData(rawData);

      const expectedTransformedData = {
        data: [
          {
            x: ["3", "2", "1", "1"],
            y: ["Rule 4", "Workplace", "Unauthorized Fo...", "Rule 1"],
            type: "bar",
            width: 0.75,
            orientation: "h",
            marker: {
              color: COLORS[0]
            },
            text: ["3", "2", "1", "1"],
            textposition: "auto",
            textangle: 0,
            hovertext: [
              "description for Arrest<br>",
              "description for Workplace<br>Workplace",
              "description for Unauthorized Force<br>Unauthorized Force",
              "description for Professionalism<br>"
            ],
            hoverinfo: "text"
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
            text: [],
            textposition: "auto",
            textangle: 0,
            hovertext: [],
            hoverinfo: "text"
          }
        ]
      };

      expect(transformedData).toEqual(expectedTransformedData);
    });
  });
});
