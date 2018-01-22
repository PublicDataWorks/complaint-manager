import React from "react";
import {connect} from "react-redux";
import {Table, TableBody, TableCell, TableHead, TableRow, Typography, withStyles} from "material-ui";
import UserRow from "./UserRow";
import getUsers from "../thunks/getUsers";
import Paper from "material-ui/Paper";
import tableStyleGenerator from "../../tableStyles";
import sortAlphabeticallyByProperty from "../../sortAlphabeticallyByProperty";

const numberOfColumns = 3;

const styles = theme => ({
    ...(tableStyleGenerator(numberOfColumns, theme).header),
    ...(tableStyleGenerator(numberOfColumns, theme).table)
})

class UsersTable extends React.Component {
    componentWillMount() {
        this.props.getUsers()
    }

    render() {
        const { classes } = this.props
        return (
            <div>
                <Typography
                    type="title"
                    className={classes.labelMargin}>
                    All Users
                </Typography>
                <Paper elevation={0} className={classes.tableMargin}>
                    <Table>
                        <TableHead>
                            <TableRow className={classes.row}>
                                <TableCell className={classes.cell}>
                                    <Typography type='body2'>
                                        Name
                                    </Typography>
                                </TableCell>
                                <TableCell className={classes.cell}>
                                    <Typography type='body2'>
                                        Email
                                    </Typography>
                                </TableCell>
                                <TableCell className={classes.cell}>
                                    <Typography type='body2'>
                                        Date Added
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortAlphabeticallyByProperty(this.props.users, 'lastName').map(user => (
                                <UserRow key={user.id} user={user}/>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    users: state.users.all
})

const mapDispatchToProps = {
    getUsers
}

export default withStyles(styles, {withTheme: true})(connect(mapStateToProps, mapDispatchToProps)(UsersTable))
