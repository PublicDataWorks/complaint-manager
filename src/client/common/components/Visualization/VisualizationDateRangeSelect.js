import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import {
  DATE_RANGE_TYPE,
  QUERY_TYPES
} from "../../../../sharedUtilities/constants";
const {
  FIRST_YEAR_DATA_IS_AVAILABLE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const VisualizationDateRangeSelect = props => {
  let dateRangeDropdownOptions =
    props.queryType ===
      QUERY_TYPES.COUNT_MONTHLY_COMPLAINTS_BY_COMPLAINANT_TYPE &&
    moment().format("MM") === "01"
      ? [{ key: DATE_RANGE_TYPE.PAST_12_MONTHS, value: "Past 12 Months" }]
      : [
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
    <FormControl
      style={{ marginLeft: "20px", marginTop: "5px", marginBottom: "5px" }}
    >
      <Select
        value={props.dateRange}
        onChange={e => props.setDateRange(e.target.value)}
        inputProps={{ "data-testid": "visualizationDateControl" }}
      >
        {dateRangeDropdownOptions.map(option => (
          <MenuItem key={option.key} value={option.key}>
            {option.value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

VisualizationDateRangeSelect.propTypes = {
  dateRange: PropTypes.string,
  setDateRange: PropTypes.func,
  queryType: PropTypes.string
};

export default VisualizationDateRangeSelect;
