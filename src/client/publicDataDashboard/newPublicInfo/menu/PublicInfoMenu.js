import React from "react";
import { withStyles } from "@material-ui/styles";
import publicInfoStyles from "../publicInfoStyles";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";

const PublicInfoMenu = ({ classes, screenSize }) => {
  const links = [
    {
      href: "#hawaii-prison-profile-dashboard",
      title: "Public Data"
    },
    {
      href: "#myths-and-facts",
      title: "Myths and Facts"
    },
    {
      href: "#staffing-shortage",
      title: "Issues"
    }
  ];

  if (screenSize === SCREEN_SIZES.MOBILE) {
    return <div></div>;
  } else {
    return (
      <div>
        <menu className={classes.menu}>
          <div
            style={{
              display: "flex"
            }}
          >
            <a href={"#Values"} className={classes.menuLink}>
              About
            </a>
            {links.map(link => (
              <a
                key={link.title}
                href={link.href}
                className={`${classes.menuLink} ${classes.menuBorderLeft}`}
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
