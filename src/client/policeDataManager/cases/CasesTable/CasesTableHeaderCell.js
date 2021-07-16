import React from "react";
import PropTypes from "prop-types";
import { TableCell, TableSortLabel, Typography } from "@material-ui/core";

const CasesTableHeaderCell = props => (
  <TableCell
    data-testid={props.testId ? `${props.testId}Header` : undefined}
    style={{ width: props.width }}
    className={props.className}
  >
    <TableSortLabel
      data-testid={props.testId ? `${props.testId}SortLabel` : undefined}
      onClick={props.onClick}
      direction={props.sortDirection}
      active={props.active}
    >
      <Typography variant="subtitle2">{props.children}</Typography>
    </TableSortLabel>
  </TableCell>
);

CasesTableHeaderCell.defaultProps = {
  active: false,
  className: "",
  onClick: () => {}
};

CasesTableHeaderCell.propTypes = {
  active: PropTypes.bool,
  children: PropTypes.element,
  className: PropTypes.string,
  onClick: PropTypes.func,
  sortDirection: PropTypes.oneOf(["asc", "desc"]),
  testId: PropTypes.string,
  width: PropTypes.string
};

export default CasesTableHeaderCell;
