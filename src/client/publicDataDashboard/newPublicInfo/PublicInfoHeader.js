import React, { useState } from "react";
import {
  IconButton,
  Drawer,
  Typography,
  Box,
  List,
  ListItem,
  Icon
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

const list = () => (
  <Box role="presentation">
    <List>
      <ListItem>
        <a href="https://hcsoc.hawaii.gov/">Home</a>
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

const PublicInfoHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      style={{
        width: "100vw",
        height: "7vh",
        backgroundColor: "#0A3449",
        color: "#FAFCFE"
      }}
    >
      <IconButton
        style={{ float: "left" }}
        color="inherit"
        size="large"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Menu />
      </IconButton>
      <Drawer anchor={"top"} open={menuOpen} onClose={() => setMenuOpen(false)}>
        {list()}
      </Drawer>
      <img src={`${config.hostname}/Pono.svg`} style={{ float: "left" }} />
      <Typography
        style={{
          float: "left",
          fontFamily: "Montserrat",
          fontSize: "32px",
          fontStyle: "italic",
          letterSpacing: "-2%"
        }}
        variant="h1"
      >
        Hawaii.gov
      </Typography>
    </header>
  );
};

export default PublicInfoHeader;
