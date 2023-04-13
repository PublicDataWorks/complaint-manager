import React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";
import tableStyleGenerator from "../../tableStyles";
import LinkButton from "../shared/components/LinkButton";

const FIELDS = [
  { name: "Name", key: "fullName" },
  { name: "PiC ID", key: "inmateId" },
  { name: "Facility", key: "facility" },
  { name: "Gender", key: "gender" },
  { name: "Race", key: "race" },
  { name: "Age", key: "age" }
];

const styles = theme => {
  let style = tableStyleGenerator(theme);
  return {
    bodyRow: style.body.row,
    bodyCell: style.body.cell,
    headerRow: style.header.row,
    headerCell: style.header.cell,
    buttonCell: style.body.buttonCell
  };
};

const SelectedInmateDisplay = ({
  caseId,
  selectedInmate,
  classes,
  roleOnCase
}) => {
  return (
    <Table style={{ marginBottom: "32px" }}>
      <TableHead>
        <TableRow className={classes.headerRow}>
          {FIELDS.map(field => (
            <TableCell
              key={field.name}
              data-testid={`${field.name.replace(" ", "")}Header`}
              className={classes.headerCell}
            >
              <Typography variant="subtitle2">{field.name}</Typography>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow className={classes.bodyRow}>
          {FIELDS.map(field => (
            <TableCell
              key={selectedInmate[field.key]}
              className={classes.bodyCell}
            >
              {selectedInmate[field.key]}
            </TableCell>
          ))}
          <TableCell className={classes.buttonCell}>
            <LinkButton
              data-testid="change-inmate-link"
              component={Link}
              to={`/cases/${caseId}/inmates/${roleOnCase}/search`}
            >
              Change
            </LinkButton>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default withStyles(styles, { withTheme: true })(SelectedInmateDisplay);
