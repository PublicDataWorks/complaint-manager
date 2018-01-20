import React from "react";
import {TableCell, TableRow} from "material-ui";
import formatDate from "../../formatDate";
import themeStyles from "../../globalStyling/styles";

const styles = {
    row: {
        height: 80,
        backgroundColor: 'white',
        borderTop: `8px solid ${themeStyles.colors.secondary[50]}`,
        borderBottom: `8px solid ${themeStyles.colors.secondary[50]}`,
        width: '100%',
        overflowX: 'scroll'
    },
    cell: {
        padding: '0%',
        width: '33%',
        textAlign: 'center',
    },
}

const UserRow = ({user: {id, firstName, lastName, email, createdAt}}) => (
    <TableRow data-test={`userRow${id}`} style={styles.row}>
        <TableCell data-test='userName' style={styles.cell}>
                {`${firstName} ${lastName}`}
        </TableCell>
        <TableCell data-test='userEmail' style={styles.cell}>
            {email}
        </TableCell>
        <TableCell data-test='userDateAdded' style={styles.cell}>
            {formatDate(createdAt)}
        </TableCell>
    </TableRow>
)

export default UserRow