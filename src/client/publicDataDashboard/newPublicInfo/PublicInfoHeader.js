import React, { useState } from "react";
import { IconButton, Typography } from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { withStyles } from "@material-ui/styles";
import publicInfoStyles from "./publicInfoStyles";
import HeaderLinks from "./HeaderLinks";
import { SCREEN_SIZES } from "../../../sharedUtilities/constants";
const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

const PublicInfoHeader = props => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}
      className={`${props.classes.header} ${
        props.classes[`header-${props.screenSize}`]
      }`}
    >
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        {props.screenSize === SCREEN_SIZES.DESKTOP ? (
          ""
        ) : (
          <IconButton
            color="inherit"
            style={{ marginRight: "-45px" }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu />
          </IconButton>
        )}
        <img
          src={`${config.hostname}/Pono.svg`}
          className={props.classes[`headerLogo-${props.screenSize}`]}
          style={{ marginLeft: "45px" }}
        />
        <Typography
          className={`${props.classes.headerText} ${
            props.classes[`headerText-${props.screenSize}`]
          }`}
          variant="h1"
        >
          Hawaii.gov
        </Typography>
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
