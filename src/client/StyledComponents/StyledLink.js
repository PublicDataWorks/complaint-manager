import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import colors from "../globalStyling/colors";
import {withStyles} from "material-ui/styles";

const styles = theme => ({
  root: {
    color: colors.blue,
    fontSize: "16pt",
    fontWeight: "medium",
    textDecoration: 'none'
  },
  primary: {
    color: theme.palette.primary[500],
  },
});

function StyledLink(props) {
  const { children, classes, className, variant, ...other } = props;

  return (
    <a
      className={classNames(
        classes.root,
        {
          [classes.primary]: variant === 'primary',
        },
        className,
      )}
      {...other}
    >
      {children}
    </a>
  );
}

StyledLink.propTypes = {
  children: PropTypes.node.isRequired,
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary']),
};

export default withStyles(styles, {withTheme: true})(StyledLink)