import { get, isEmpty } from "lodash";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import { DATE_RANGE_TYPE } from "../../../../sharedUtilities/constants";
import { TITLE_FONT } from "./dataVizStyling";

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

export const getAggregateVisualizationLayout = ({
  queryModel = null,
  queryOptions = {},
  isPublic = false,
  isMobile = false,
  newData = {}
}) => {
  let aggregateLayout = queryModel.baseLayout;

  if (isEmpty(aggregateLayout)) {
    throw new Error(BAD_REQUEST_ERRORS.DATA_QUERY_TYPE_NOT_SUPPORTED);
  }

  const currentExtendedLayout = queryModel.extendedLayout;
  const currentMobileLayout = queryModel.mobileLayout;

  if (isPublic) {
    aggregateLayout = { ...aggregateLayout, ...currentExtendedLayout };

    if (isMobile) {
      aggregateLayout = { ...aggregateLayout, ...currentMobileLayout };
    }
  }

  if (queryOptions.dateRangeType) {
    const currentTitle = get(aggregateLayout, ["title", "text"], "");
    const currentSubtitle = isNaN(queryOptions.dateRangeType)
      ? subtitles[queryOptions.dateRangeType] || ""
      : queryOptions.dateRangeType;
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

  const currentDynamicProps = queryModel.layoutProps;
  return {
    ...aggregateLayout,
    ...evaluateDynamicProps(currentDynamicProps, newData)
  };
};
