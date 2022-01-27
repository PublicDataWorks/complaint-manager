import Visualization from "./visualization.model";

export default class DonutVisualization extends Visualization {
  generateCenterAnnotations(count = 0, unit = "Complaints") {
    return [
      {
        font: {
          size: 40
        },
        showarrow: false,
        text: count,
        x: 0.5,
        y: 0.55
      },
      {
        font: {
          size: 20
        },
        showarrow: false,
        text: unit,
        x: 0.5,
        y: 0.45
      }
    ];
  }
}
