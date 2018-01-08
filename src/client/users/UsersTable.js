import React from "react";
import {connect} from "react-redux";
import {Table, TableBody, TableCell, TableHead, TableRow, Typography} from "material-ui";
import UserRow from "./UserRow";

class UsersTable extends React.Component {
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


export default connect(mapStateToProps)(UsersTable)
