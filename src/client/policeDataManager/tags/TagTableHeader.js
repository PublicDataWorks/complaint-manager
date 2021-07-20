import React from "react";
import PropTypes from "prop-types";
import { TableCell, TableSortLabel, Typography } from "@material-ui/core";

const TagTableHeader = props => (
  <TableCell className={props.classes.cell}>
    <TableSortLabel
      direction={props.sortDirection}
      active={props.active}
      data-testid={`sortTagsBy${props.value
        .substring(0, 1)
        .toUpperCase()}${props.value.substring(1)}Header`}
      onClick={() => props.changeSort(props.value)}
    >
      <Typography variant="subtitle2">{props.children}</Typography>
    </TableSortLabel>
  </TableCell>
);

TagTableHeader.defaultProps = {
  active: false,
  changeSort: () => {},
  classes: {},
  sortDirection: "asc"
};

TagTableHeader.propTypes = {
  active: PropTypes.bool,
  changeSort: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  classes: PropTypes.shape({
    cell: PropTypes.string
  }),
  value: PropTypes.string.isRequired,
  sortDirection: PropTypes.oneOf(["asc", "desc"])
};

export default TagTableHeader;
