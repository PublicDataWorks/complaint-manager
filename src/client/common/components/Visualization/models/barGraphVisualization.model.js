import Visualization from "./visualization.model";
import { LABEL_FONT } from "../dataVizStyling";

export default class BarGraphVisualization extends Visualization {
  generateEmptyLayout(numberOfXValues, numberOfYValues, elementName = "Tags") {
    const layout = {};

    if (numberOfXValues + numberOfYValues === 0) {
      layout.annotations = [
        {
          text: `No ${elementName} to display`,
          y: 1,
          showarrow: false,
          font: LABEL_FONT
        }
      ];

      layout.dragmode = false;

      layout.yaxis = {
        zeroline: false,
        showgrid: false,
        showticklabels: false
      };

      layout.xaxis = {
        zeroline: true,
        showgrid: false,
        showticklabels: false
      };
    }

    return layout;
  }
}
