import React from "react";
import { withStyles } from "@material-ui/styles";
import publicInfoStyles from "../publicInfoStyles";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";

const PublicInfoMenu = ({ classes, screenSize }) => {
  const menuLinks = [
    {
      id: "values",
      title: "About"
    },
    {
      id: "hawaii-prison-profile-dashboard",
      title: "Public Data"
    },
    {
      id: "staffing-shortage",
      title: "Issues"
    },
    {
      id: "myths-and-facts",
      title: "Myths and Facts"
    }
  ];

  const handleAnimation = (linkId, e) => {
    e.preventDefault();
    const section = document.getElementById(linkId);
    section.scrollIntoView({ behavior: "smooth" });
  };

  const applyLeftBorderExceptFirstChild = index => {
    return index !== 0 ? classes.menuBorderLeft : "";
  };

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
            {menuLinks.map((link, index) => (
              <a
                key={link.title}
                className={`${classes.menuLink} ${
                  classes[`menuLink-${screenSize}`]
                } ${applyLeftBorderExceptFirstChild(index)}`}
                onClick={e => handleAnimation(link.id, e)}
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
