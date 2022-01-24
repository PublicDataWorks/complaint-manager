import React from "react";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { PlotlyWrapper } from "./PlotlyWrapper";
import { getVisualizationData } from "./getVisualizationData";
import { getAggregateVisualizationLayout } from "./getAggregateVisualizationLayout";
import { getVisualizationConfig } from "./getVisualizationConfig";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {
  DATE_RANGE_TYPE,
  ISO_DATE
} from "../../../../sharedUtilities/constants";
import moment from "moment";
import VisualizationDateRangeSelect from "./VisualizationDateRangeSelect";

const isAYear = input => (input ? /^\d{4}$/.test(input) : false);

export const generateDateRange = range => {
  if (isAYear(range)) {
    return {
      minDate: `${range}-01-01`,
      maxDate: `${parseInt(range) + 1}-01-01`
    };
  } else if (range === DATE_RANGE_TYPE.YTD) {
    return {
      minDate: `${moment().format("YYYY")}-01-01`
    };
  } else {
    return {
      minDate: moment().subtract(12, "months").format(ISO_DATE)
    };
  }
};

const Visualization = ({ queryType, isPublic, queryOptions, hasDropdown }) => {
  const [data, setData] = useState({ data: [], isFetching: true });
  const [layout, setLayout] = useState({});
  const [config, setConfig] = useState({});
  const [dateRange, setDateRange] = useState(queryOptions?.dateRangeType);
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await getVisualizationData({
          queryType,
          isPublic,
          queryOptions: generateDateRange(dateRange)
        });

        setData({ data: newData.data, isFetching: false });
      } catch (error) {
        console.error(error);
        setData({ data: {}, isFetching: false });
      }
    };

    fetchData();
  }, [queryType, isPublic, dateRange]);

  useEffect(() => {
    const createConfig = () => {
      const config = { ...getVisualizationConfig(queryType) };
      setConfig({ ...config });
    };

    const createLayout = () => {
      const newLayout =
        getAggregateVisualizationLayout({
          newData: data,
          queryType,
          queryOptions: { dateRangeType: dateRange },
          isPublic,
          isMobile
        }) || {};
      setLayout({ ...newLayout });
    };

    createLayout();
    createConfig();
  }, [data, queryType, queryOptions, isPublic, isMobile]);

  return (
    <section>
      <section style={{ minHeight: "40px" }}>
        {hasDropdown ? (
          <VisualizationDateRangeSelect
            dateRange={dateRange}
            setDateRange={setDateRange}
            queryType={queryType}
          />
        ) : (
          ""
        )}
      </section>
      <PlotlyWrapper
        style={{ height: "100%", width: "100%" }}
        data={isEmpty(data.data) ? [] : data.data}
        layout={layout}
        config={config}
      />
    </section>
  );
};

export default Visualization;
