import React, { useEffect } from "react";
import { connect } from "react-redux";
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
import getTagsWithCount from "./thunks/getTagsWithCount";

const styles = theme => ({
  ...tableStyleGenerator(theme).header,
  ...tableStyleGenerator(theme).table
});

export const TagManagementPage = props => {
  useEffect(() => {
    if (!props.tags || !props.tags.length || !props.tags[0].count) {
      props.getTagsWithCount();
    }
  }, []);

  return (
    <main>
      <NavBar menuType={policeDataManagerMenuOptions}>Tag Management</NavBar>
      <div style={{ marginTop: "24px" }} className={props.classes.tableMargin}>
        {props.tags && props.tags.length ? (
          <SearchResults
            searchResultsLength={props.tags ? props.tags.length : 0}
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
                {props.tags
                  ? props.tags.map(tag => (
                      <TagTableRow tag={tag} key={tag.id} />
                    ))
                  : ""}
              </TableBody>
            </Table>
          </SearchResults>
        ) : (
          "No Tags Found"
        )}
      </div>
    </main>
  );
};

export default withStyles(styles, { withTheme: true })(
  connect(
    state => ({
      tags: state?.ui?.tags
    }),
    { getTagsWithCount }
  )(TagManagementPage)
);
