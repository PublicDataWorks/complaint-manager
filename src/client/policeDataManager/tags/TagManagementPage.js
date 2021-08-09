import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { Table, TableBody, TableHead, TableRow } from "@material-ui/core";
import tableStyleGenerator from "../../tableStyles";
import { policeDataManagerMenuOptions } from "../shared/components/NavBar/policeDataManagerMenuOptions";
import NavBar from "../shared/components/NavBar/NavBar";
import SearchResults from "../shared/components/SearchResults";
import TagTableRow from "./TagTableRow";
import getTagsWithCount from "./thunks/getTagsWithCount";
import clearTagManagement from "./thunks/clearTagManagement";
import { ASCENDING, DESCENDING } from "../../../sharedUtilities/constants";
import TagTableHeader from "./TagTableHeader";

const styles = theme => ({
  ...tableStyleGenerator(theme).header,
  ...tableStyleGenerator(theme).table
});

export const TagManagementPage = props => {
  const [sort, setSort] = useState({ by: "count", direction: DESCENDING });

  useEffect(() => {
    props.getTagsWithCount();

    return () => {
      props.clearTagManagement();
    };
  }, []);

  const changeSort = sortBy => {
    let sortDirection =
      sort.by === sortBy && sort.direction === ASCENDING
        ? DESCENDING
        : ASCENDING;
    props.getTagsWithCount(sortBy, sortDirection);
    setSort({ by: sortBy, direction: sortDirection });
  };

  return (
    <main>
      <NavBar menuType={policeDataManagerMenuOptions}>Tag Management</NavBar>
      <div style={{ marginTop: "24px" }} className={props.classes.tableMargin}>
        {props.loading || (props.tags && props.tags.length) ? (
          <SearchResults
            searchResultsLength={props.tags ? props.tags.length : 0}
            spinnerVisible={props.loading}
            subtitleResultCount={false}
          >
            <Table
              style={{ marginBottom: "32px" }}
              data-testid="tag-management-table"
            >
              <TableHead>
                <TableRow className={props.classes.row}>
                  <TagTableHeader
                    active={sort.by === "name"}
                    changeSort={changeSort}
                    classes={props.classes}
                    value="name"
                    sortDirection={sort.direction}
                  >
                    TAG NAME
                  </TagTableHeader>
                  <TagTableHeader
                    active={sort.by === "count"}
                    changeSort={changeSort}
                    classes={props.classes}
                    value="count"
                    sortDirection={sort.direction}
                  >
                    ASSOCIATED COMPLAINTS
                  </TagTableHeader>
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
      tags: state?.ui?.tags,
      loading: state?.ui?.tagManagement?.loading
    }),
    { getTagsWithCount, clearTagManagement }
  )(TagManagementPage)
);
