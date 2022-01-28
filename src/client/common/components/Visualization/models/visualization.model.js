import axios from "axios";
import { get, isEmpty } from "lodash";
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";
import { DATE_RANGE_TYPE } from "../../../../../sharedUtilities/constants";
import { LABEL_FONT, TITLE_FONT } from "../dataVizStyling";

export default class Visualization {
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

  get visualizationConfig() {
    return {};
  }

  transformData(rawData) {
    return rawData;
  }

  async getVisualizationData({ isPublic = false, queryOptions = {} }) {
    const queryOptionParams = Object.keys(queryOptions)
      .map(key => `&${key}=${queryOptions[key]}`)
      .join("");

    const { data } = await axios.get(
      `/api/${isPublic ? "public-" : ""}data?queryType=${
        this.queryType
      }${queryOptionParams}`
    );

    return this.transformData(data);
  }

  getVisualizationLayout({
    options = {},
    isPublic = false,
    isMobile = false,
    newData = {}
  }) {
    let aggregateLayout = this.baseLayout;

    if (isEmpty(aggregateLayout)) {
      throw new Error(BAD_REQUEST_ERRORS.DATA_QUERY_TYPE_NOT_SUPPORTED);
    }

    const currentExtendedLayout = this.extendedLayout;
    const currentMobileLayout = this.mobileLayout;

    if (isPublic) {
      aggregateLayout = { ...aggregateLayout, ...currentExtendedLayout };

      if (isMobile) {
        aggregateLayout = { ...aggregateLayout, ...currentMobileLayout };
      }
    }

    if (options.dateRangeType) {
      const currentTitle = get(aggregateLayout, ["title", "text"], "");
      const currentSubtitle = isNaN(options.dateRangeType)
        ? subtitles[options.dateRangeType] || ""
        : options.dateRangeType;
      const newSubtitle = [currentTitle, currentSubtitle].join("<br><sub>");

      if (currentTitle) {
        const title = {
          text: newSubtitle,
          font: TITLE_FONT
        };

        aggregateLayout = {
          ...aggregateLayout,
          ...{ title }
        };
      }
    }

    const currentDynamicProps = this.layoutProps;
    return {
      ...aggregateLayout,
      ...evaluateDynamicProps(currentDynamicProps, newData)
    };
  }
}

export const FULL_LAYOUT = "FULL_LAYOUT";

export const subtitles = {
  [DATE_RANGE_TYPE.PAST_12_MONTHS]: "Past 12 Months",
  [DATE_RANGE_TYPE.YTD]: "Year-to-Date"
};

export const evaluateDynamicProps = (currentDynamicProps, newData) => {
  let currentDynamicLayout = {};

  Object.keys(currentDynamicProps).forEach(propName => {
    const [callback, ...params] = currentDynamicProps[propName];

    const allValues = params.map(paramName => get(newData, paramName, null));
    const extraProps = callback.apply(null, allValues);

    if (propName === FULL_LAYOUT) {
      currentDynamicLayout = { ...currentDynamicLayout, ...extraProps };
    } else {
      currentDynamicLayout[propName] = extraProps;
    }
  });

  return currentDynamicLayout;
};
