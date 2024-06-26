import CountTop10Allegations from "./countTop10Allegations.model";
import { COLORS } from "../dataVizStyling";

describe("CountTop10Allegations model", () => {
  let model = new CountTop10Allegations();
  describe("data transformer", () => {
    test("should transform the rawData from the handler for the visualization component", () => {
      const rawData = [
        {
          rule: "Rule 1",
          paragraph:
            "description for Professionalism. This is a really long description that we are using here to exemplify the point of a test we are validating.",
          count: "1"
        },
        {
          rule: "Rule 2",
          paragraph: "PARAGRAPH: description for Unauthorized Force",
          count: "1"
        },
        {
          rule: "Rule 3",
          paragraph: "paragraph(3): description for Workplace",
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
            x: ["3"],
            y: ["Rule 4<br>description for Arrest"],
            type: "bar",
            width: 0.5,
            orientation: "h",
            marker: { color: "#002171" },
            text: ["3"],
            textposition: "auto",
            textangle: 0,
            hoverinfo: "text",
            hovertext: ["Rule 4<br>description for Arrest"]
          },
          {
            x: ["2"],
            y: ["Rule 3<br>PAR.(3): description for Workplace"],
            type: "bar",
            width: 0.5,
            orientation: "h",
            marker: { color: "#002171" },
            text: ["2"],
            textposition: "auto",
            textangle: 0,
            hoverinfo: "text",
            hovertext: ["Rule 3<br>paragraph(3): description for Workplace"]
          },
          {
            x: ["1"],
            y: ["Rule 2<br>PAR.: description for Unauthorized Force"],
            type: "bar",
            width: 0.5,
            orientation: "h",
            marker: { color: "#002171" },
            text:["1"],
            textposition: "auto",
            textangle: 0,
            hoverinfo: "text",
            hovertext: [
              "Rule 2<br>PARAGRAPH: description for Unauthorized <br>Force"
            ]
          },
          {
            x: ["1"],
            y: ["Rule 1<br>description for Professionalism. This is..."],
            type: "bar",
            width: 0.5,
            orientation: "h",
            marker: { color: "#002171" },
            text:["1"],
            textposition: "auto",
            textangle: 0,
            hoverinfo: "text",
            hovertext: [
              "Rule 1<br>description for Professionalism. This is<br> a really long description that we are u<br>sing here to exemplify the point of a te<br>st we are validating."
            ]
          }
        ]
      };

      expect(transformedData).toEqual(expectedTransformedData);
    });
    test("should display the rule and paragraph in the y-value and the number of each in the x-value", () => {
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
            x: ["3"],
            y: ["Rule 4<br>description for Arrest"],
            type: "bar",
            width: 0.5,
            orientation: "h",
            marker: {
              color: COLORS[0]
            },
            text: ["3"],
            textposition: "auto",
            textangle: 0,
            hoverinfo: "text",
            hovertext: expect.any(Array)
          },
          {
            x: ["2"],
            y: ["Rule 3<br>description for Workplace"],
            type: "bar",
            width: 0.5,
            orientation: "h",
            marker: {
              color: COLORS[0]
            },
            text: ["2"],
            textposition: "auto",
            textangle: 0,
            hoverinfo: "text",
            hovertext: expect.any(Array)
          },
          {
            x: ["1"],
            y: ["Rule 2<br>description for Unauthorized Force"],
            type: "bar",
            width: 0.5,
            orientation: "h",
            marker: {
              color: COLORS[0]
            },
            text: ["1"],
            textposition: "auto",
            textangle: 0,
            hoverinfo: "text",
            hovertext: expect.any(Array)
          },
          {
            x: ["1"],
            y: ["Rule 1<br>description for Professionalism"],
            type: "bar",
            width: 0.5,
            orientation: "h",
            marker: {
              color: COLORS[0]
            },
            text: ["1"],
            textposition: "auto",
            textangle: 0,
            hoverinfo: "text",
            hovertext: expect.any(Array)
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
            width: 0.5,
            orientation: "h",
            marker: {
              color: COLORS[0]
            },
            text: [],
            textposition: "auto",
            textangle: 0,
            hoverinfo: "none",
            hovertext: []
          }
        ]
      };

      expect(transformedData).toEqual(expectedTransformedData);
    });
  });
});
