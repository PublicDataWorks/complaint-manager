import React, { useState } from "react";
import { withStyles } from "@material-ui/styles";
import publicInfoStyles from "../publicInfoStyles";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import { Box, Drawer, List, ListItem } from "@material-ui/core";

const PublicInfoMenu = props => {
  const links = [
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

  if (props.screenSize === SCREEN_SIZES.MOBILE) {
    return <div></div>;
  } else {
    return (
      <div>
        <menu className={`${props.classes.menu} `}>
          <div
            style={{
              display: "flex"
            }}
          >
            <a href={"#"} className={`${props.classes.menuLink}`}>
              About
            </a>
            {links.map(link => (
              <a
                key={link.title}
                href={link.href}
                className={`${props.classes.menuLink} ${props.classes.menuBorderLeft}`}
              >
                {link.title}
              </a>
            ))}
          </div>
        </menu>
      </div>
    );
  }
};

export default withStyles(publicInfoStyles)(PublicInfoMenu);
