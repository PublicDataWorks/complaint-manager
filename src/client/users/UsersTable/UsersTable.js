import React from "react";
import {connect} from "react-redux";
import {Table, TableBody, TableCell, TableHead, TableRow, Typography} from "material-ui";
import UserRow from "./UserRow";
import getUsers from "../thunks/getUsers";
import Paper from "material-ui/Paper";
import themeStyles from "../../globalStyling/styles";

const styles = {
    cell: {
        padding: '0%',
        textAlign: 'center',
    },
    tableHeadColor: {
        backgroundColor: themeStyles.colors.secondary[50]
    },
    tableHeadRow: {
        width: '100%',
        overflowX: 'scroll'
    },
    tableMargin: {
        marginLeft: '5%',
        marginRight: '5%',
        marginBottom: '3%'
    },
    labelMargin: {
        marginLeft: '5%',
    }
}

class UsersTable extends React.Component {
    componentWillMount() {
        this.props.getUsers()
    }

    render() {
        return (
            <div>
                <Typography
                    type="title"
                    style={styles.labelMargin}>
                    All Users
                </Typography>
                <Paper elevation={0} style={styles.tableMargin}>
                    <Table>
                        <TableHead style={styles.tableHeadColor}>
                            <TableRow style={styles.tableHeadRow}>
                                <TableCell style={styles.cell}>
                                    <Typography type='body2'>
                                        Name
                                    </Typography>
                                </TableCell>
                                <TableCell style={styles.cell}>
                                    <Typography type='body2'>
                                        Email
                                    </Typography>
                                </TableCell>
                                <TableCell style={styles.cell}>
                                    <Typography type='body2'>
                                        Date Added
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.users.map(user => (
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

export default connect(mapStateToProps, mapDispatchToProps)(UsersTable)
