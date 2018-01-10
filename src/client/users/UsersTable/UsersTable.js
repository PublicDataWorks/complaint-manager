import React from "react";
import {connect} from "react-redux";
import {Table, TableBody, TableCell, TableHead, TableRow, Typography} from "material-ui";
import UserRow from "./UserRow";
import getUsers from "../thunks/getUsers";

class UsersTable extends React.Component {
    componentWillMount() {
        this.props.getUsers()
    }

    render() {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography type='body2'>
                                <div>Name</div>
                                <div>Email</div>
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <Typography type='body2'>
                                Date Added
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.props.users.map(user => (
                        <UserRow key={user.id} user={user} />
                    ))}
                </TableBody>
            </Table>
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
