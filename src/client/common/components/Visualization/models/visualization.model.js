import { LABEL_FONT } from "../dataVizStyling";

class Visualization {
  get queryType() {
    return "";
  }

  get baseLayout() {
    return {
      showlegend: false,
      font: LABEL_FONT
    };
  }

  get extendedLayout() {
    return {};
  }

  get mobileLayout() {
    return {};
  }

  get layoutProps() {
    return {};
  }
}

export default Visualization;
