import React from "react";
import { Box, Drawer, Link, List, ListItem, Menu, MenuItem } from "@material-ui/core";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import CallIcon from "@material-ui/icons/Call";
import HomeIcon from "@material-ui/icons/Home";
import LanguageIcon from "@material-ui/icons/Language";

const MenuLinks = ({screenSize}) => {
    if (screenSize === SCREEN_SIZES.DESKTOP || SCREEN_SIZES.TABLET) {
        return (
            <Link>About</Link>
        )

    }
}

export default MenuLinks;