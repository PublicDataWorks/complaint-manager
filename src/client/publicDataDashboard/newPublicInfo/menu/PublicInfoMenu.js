import React, { useState } from "react";
import { withStyles } from "@material-ui/styles";
import publicInfoStyles from "../publicInfoStyles";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import { Box, Drawer, List, ListItem } from "@material-ui/core";


const PublicInfoMenu = props => {
  const links = [
    {
      href: "#",
      title: "About"
    },
    {
      href: "#",
      title: "Public Data"
    },
    {
      href: "#",
      title: "Issues"
    },
    {
        href: "#",
        title: "Stories"
      },
      {
        href: "#",
        title: "FAQ"
      }
  ];

  return (
    <menu
    style={{
        justifyContent: "space-between",
        alignItems: "center"
      }}
      className={`${props.classes.menu} ${
        props.classes[`menu-${props.screenSize}`]
      }`}>
        {links.map(link => (
            <a
                href={link.href}
                className={`${props.classes.menuLink}`}
            >
                {link.title}
            </a>
        ))}
    </menu>
  );
};

export default withStyles(publicInfoStyles)(PublicInfoMenu);
