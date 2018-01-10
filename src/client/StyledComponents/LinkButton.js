import {Button, withStyles, withTheme} from "material-ui";
import React from "react";

const styles = theme => ({
    button: {
        color: theme.palette.blue,
        fontSize: "0.875rem",
        fontWeight: 500,
        textDecoration: 'none'
    }
})

const LinkButton = ({classes, children, ...other}) => (
    <Button
        className={classes.button}
        {...other}>{children}</Button>
)

export default withStyles(styles, {withTheme: true})(LinkButton)