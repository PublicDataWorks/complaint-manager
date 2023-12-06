import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { Menu } from "@material-ui/icons";
import { withStyles } from "@material-ui/styles";
import publicInfoStyles from "../publicInfoStyles";
import HeaderLinks from "./HeaderLinks";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

const PublicInfoHeader = props => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`${props.classes.header} ${
        props.classes[`header-${props.screenSize}`]
      }`}
    >
      <div className={props.classes.headerContent}>
        {props.screenSize === SCREEN_SIZES.DESKTOP ? (
          ""
        ) : (
          <IconButton
            aria-label="Menu"
            color="inherit"
            style={{ marginRight: "-45px" }}
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="delicious-menu"
          >
            <Menu />
          </IconButton>
        )}
        <a
          href="https://portal.ehawaii.gov/"
          target="_blank"
          className={props.classes.headerLinks}
        >
          <img
            src={`${config.frontendUrl}/images/Pono.svg`}
            alt="white outline of hibiscus flower"
            className={props.classes[`headerLogo-${props.screenSize}`]}
            style={{ marginLeft: "45px" }}
          />
          <Typography
            className={`${props.classes.headerText} ${
              props.classes[`headerText-${props.screenSize}`]
            }`}
            variant="h1"
          >
            hawaii.gov
          </Typography>
        </a>
      </div>
      <HeaderLinks
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        screenSize={props.screenSize}
        classes={props.classes}
      />
    </header>
  );
};

export default withStyles(publicInfoStyles)(PublicInfoHeader);
