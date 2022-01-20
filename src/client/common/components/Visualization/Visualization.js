import React from "react";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { PlotlyWrapper } from "./PlotlyWrapper";
import { getVisualizationData } from "./getVisualizationData";
import { getAggregateVisualizationLayout } from "./getAggregateVisualizationLayout";
import { getVisualizationConfig } from "./getVisualizationConfig";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import { DATE_RANGE_TYPE } from "../../../../sharedUtilities/constants";
import moment from "moment";
const {
  FIRST_YEAR_DATA_IS_AVAILABLE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const isAYear = input => (input ? /^\d{4}$/.test(input) : false);

export const generateDateRange = range => {
  if (isAYear(range)) {
    return {
      minDate: `${range}-01-01`,
      maxDate: `${range}-12-31`
    };
  } else if (range === DATE_RANGE_TYPE.YTD) {
    return {
      minDate: `${moment().format("YYYY")}-01-01`
    };
  } else {
    return {
      minDate: moment().subtract(12, "months").format("YYYY-MM-DD")
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

  let dateRangeDropdownOptions = [
    { key: DATE_RANGE_TYPE.PAST_12_MONTHS, value: "Past 12 Months" },
    { key: DATE_RANGE_TYPE.YTD, value: "Year-to-date" }
  ];

  for (
    let i = parseInt(moment().format("YYYY")) - 1;
    i >= FIRST_YEAR_DATA_IS_AVAILABLE;
    i--
  ) {
    dateRangeDropdownOptions.push({ key: i + "", value: i + "" });
  }

  return (
    <section>
      <section style={{ minHeight: "40px" }}>
        {hasDropdown ? (
          <FormControl style={{ marginLeft: "20px", marginTop: "5px" }}>
            <Select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              inputProps={{ "data-testid": "visualizationDateControl" }}
            >
              {dateRangeDropdownOptions.map(option => (
                <MenuItem key={option.key} value={option.key}>
                  {option.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
