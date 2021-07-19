import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography
} from "@material-ui/core";
import tableStyleGenerator from "../../tableStyles";
import { policeDataManagerMenuOptions } from "../shared/components/NavBar/policeDataManagerMenuOptions";
import NavBar from "../shared/components/NavBar/NavBar";
import SearchResults from "../shared/components/SearchResults";
import TagTableRow from "./TagTableRow";

const DUMMY_DATA = [
  // TODO remove
  { name: "tag with lots of complaints", count: 17, id: 4 },
  { name: "tag with some complaints", count: 5, id: 2 },
  { name: "tag with one complaint", count: 1, id: 3 }
];

const styles = theme => ({
  ...tableStyleGenerator(theme).header,
  ...tableStyleGenerator(theme).table
});

const TagManagementPage = props => {
  return (
    <main>
      <NavBar menuType={policeDataManagerMenuOptions}>Tag Management</NavBar>
      <div style={{ marginTop: "24px" }} className={props.classes.tableMargin}>
        <SearchResults
          searchResultsLength={DUMMY_DATA.length}
          spinnerVisible={false}
          subtitleResultCount={false}
        >
          <Table style={{ marginBottom: "32px" }}>
            <TableHead>
              <TableRow className={props.classes.row}>
                <TableCell className={props.classes.cell}>
                  <TableSortLabel>
                    <Typography variant="subtitle2">TAG NAME</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell className={props.classes.cell}>
                  <TableSortLabel>
                    <Typography variant="subtitle2">
                      ASSOCIATED COMPLAINTS
                    </Typography>
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {DUMMY_DATA.map(tag => (
                <TagTableRow tag={tag} key={tag.id} />
              ))}
            </TableBody>
          </Table>
        </SearchResults>
      </div>
    </main>
  );
};

export default withStyles(styles, { withTheme: true })(TagManagementPage);
