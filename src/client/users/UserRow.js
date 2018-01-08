import React from "react";
import {TableCell, TableRow} from "material-ui";
import formatDate from "../formatDate";

const UserRow = ({user: {id, firstName, lastName, email, createdAt}}) => (
    <TableRow data-test={`userRow${id}`}>
        <TableCell>
            <div data-test='userName'>
                {`${firstName} ${lastName}`}
            </div>
            <div data-test='userEmail'>
                {email}
            </div>
        </TableCell>
        <TableCell data-test='userDateAdded'>
            {formatDate(createdAt)}
        </TableCell>
    </TableRow>
)

export default UserRow