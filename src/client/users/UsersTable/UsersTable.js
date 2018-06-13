import React from "react";
import { connect } from "react-redux";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import UserRow from "./UserRow";
import getUsers from "../thunks/getUsers";
import tableStyleGenerator from "../../tableStyles";
import _ from "lodash";

const styles = theme => ({
  ...tableStyleGenerator(theme).header,
  ...tableStyleGenerator(theme).table
});

class UsersTable extends React.Component {
  componentDidMount() {
    this.props.getUsers();
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography variant="title" className={classes.labelMargin}>
          All Users
        </Typography>
        <Paper elevation={0} className={classes.tableMargin}>
          <Table>
            <TableHead>
              <TableRow className={classes.row}>
                <TableCell className={classes.cell}>
                  <Typography variant="body2">Name</Typography>
                </TableCell>
                <TableCell className={classes.cell}>
                  <Typography variant="body2">Email</Typography>
                </TableCell>
                <TableCell className={classes.cell}>
                  <Typography variant="body2">Date Added</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.sortBy(this.props.users, "lastName").map(user => (
                <UserRow key={user.id} user={user} />
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  users: state.users.all
});

const mapDispatchToProps = {
  getUsers
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(UsersTable)
);
