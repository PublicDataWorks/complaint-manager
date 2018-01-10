import {Button, withStyles} from "material-ui";
import React from "react";
import themeStyles from '../globalStyling/styles'

const styles = () => ({
    button: themeStyles.link
})

const LinkButton = ({classes, children, ...other}) => (
    <Button
        className={classes.button}
        {...other}>{children}</Button>
)

export default withStyles(styles)(LinkButton)