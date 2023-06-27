import React from "react";
import { Box, Drawer, List, ListItem } from "@material-ui/core";
import { SCREEN_SIZES } from "../../../sharedUtilities/constants";
import CallIcon from "@material-ui/icons/Call";
import HomeIcon from "@material-ui/icons/Home";
import LanguageIcon from "@material-ui/icons/Language";

const HeaderLinks = ({ menuOpen, setMenuOpen, screenSize, classes }) => {
  const links = [
    {
      icon: <HomeIcon />,
      href: "https://hcsoc.hawaii.gov/",
      title: "Home"
    },
    {
      icon: <CallIcon />,
      href: "https://hcsoc.hawaii.gov/contact-us/",
      title: "Contact"
    },
    {
      icon: <LanguageIcon />,
      href: "https://stayconnected.hawaii.gov/",
      title: "Stay Connected"
    }
  ];

  if (screenSize === SCREEN_SIZES.DESKTOP) {
    return (
      <div style={{ display: "flex", columnGap: "35px", marginRight: "45px" }}>
        {links.map(link => (
          <a
            key={link.title}
            href={link.href}
            className={`${classes.headerLink} ${classes.textWithIcon}`}
          >
            {link.icon}
            {link.title}
          </a>
        ))}
      </div>
    );
  } else {
    return (
      <Drawer anchor={"top"} open={menuOpen} onClose={() => setMenuOpen(false)}>
        <Box role="presentation" className={classes.header}>
          <List>
            {links.map(link => (
              <ListItem key={link.title}>
                <a
                  href={link.href}
                  className={`${classes.headerLink} ${classes.textWithIcon}`}
                >
                  {link.icon}
                  {link.title}
                </a>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    );
  }
};

export default HeaderLinks;
