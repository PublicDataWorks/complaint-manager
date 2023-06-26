import React, { useMemo, useState } from "react";
import {
  IconButton,
  Drawer,
  Typography,
  Box,
  List,
  ListItem
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import { withStyles } from "@material-ui/styles";
import publicInfoStyles from "./publicInfoStyles";
const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

const list = () => (
  <Box role="presentation">
    <List>
      <ListItem>
        <a classhref="https://hcsoc.hawaii.gov/">Home</a>
      </ListItem>
      <ListItem>
        <a href="https://hcsoc.hawaii.gov/contact-us/">Contact</a>
      </ListItem>
      <ListItem>
        <a href="https://stayconnected.hawaii.gov/">Stay Connected</a>
      </ListItem>
    </List>
  </Box>
);

const PublicInfoHeader = props => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`${props.classes.header} ${
        props.classes[`header-${props.screenSize}`]
      }`}
    >
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <IconButton color="inherit" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu />
        </IconButton>
        <Drawer
          anchor={"top"}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
        >
          {list()}
        </Drawer>
        <img
          src={`${config.hostname}/Pono.svg`}
          className={props.classes[`headerLogo-${props.screenSize}`]}
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
    </header>
  );
};

export default withStyles(publicInfoStyles)(PublicInfoHeader);
