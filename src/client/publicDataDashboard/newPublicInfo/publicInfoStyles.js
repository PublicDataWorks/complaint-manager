import { SCREEN_SIZES } from "../../../sharedUtilities/constants";

const colors = {
  primaryBrand: "#0A3449",
  light: "#FAFCFE",
  secondaryBrand: "#22767C",
  tertiaryBrand: "#5576A0",
  dark: "#0E0E2C",
  text: "#222",
  subtleText: "#8C8CA1",
  accent: "#ECF1F4",
  success: "#1C6E1F",
  links: "#0067A3"
};

const publicInfoStyles = theme => ({
  header: {
    width: "100vw",
    backgroundColor: colors.primaryBrand,
    color: colors.light
  },
  [`header-${SCREEN_SIZES.MOBILE}`]: {
    height: "4em"
  },
  [`header-${SCREEN_SIZES.TABLET}`]: {
    height: "5em"
  },
  [`header-${SCREEN_SIZES.DESKTOP}`]: {
    height: "6em"
  },
  [`headerLogo-${SCREEN_SIZES.MOBILE}`]: {
    width: "35px"
  },
  [`headerLogo-${SCREEN_SIZES.TABLET}`]: {
    width: "40px"
  },
  [`headerLogo-${SCREEN_SIZES.DESKTOP}`]: {
    width: "45px"
  },
  headerText: {
    fontStyle: "italic",
    letterSpacing: "-2%",
    fontFamily: "times, serif"
  },
  [`headerText-${SCREEN_SIZES.MOBILE}`]: {
    fontSize: "32px"
  },
  [`headerText-${SCREEN_SIZES.TABLET}`]: {
    fontSize: "40px"
  },
  [`headerText-${SCREEN_SIZES.DESKTOP}`]: {
    fontSize: "40px"
  },
  textWithIcon: {
    display: "flex",
    alignItems: "center",
    columnGap: "5px"
  },
  headerLink: {
    color: "inherit",
    textDecoration: "none",
    "&:hover": {
      color: "#C8DDDE",
      textDecoration: "underline"
    }
  },
  link: {
    color: colors.links,
    textDecoration: "none"
  },
  menu: {
    width: "100vw",
    height: "1em",
    display: "inline-flex",
    padding: "20px 0px 20px",
    justifyContent: "center",
    color: colors.dark
  },
  menuLink: {
    color: colors.dark,
    padding: "0px 32px",
    textDecoration: "none",
    "&:hover": {
      color: colors.secondaryBrand
    }
  },
  menuBorderLeft: {
    borderLeft: "solid 1px #bbbcbd"
  }
});

export default publicInfoStyles;
