import { SCREEN_SIZES } from "../../../sharedUtilities/constants";
const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

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
  links: "#0067A3",
  gradientDark: "rgba(19, 35, 45, 1)",
  gradientLight: "rgba(29, 39, 45, 0)"
};

const images = {
  banner: `${config.frontendUrl}/Hawaii-Hero_banner.png` //need to find correct url
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
  },
  banner: {
    background: `linear-gradient(to bottom right, ${colors.gradientDark}, ${colors.gradientLight}), url(${images.banner});`,
    backgroundRepeat: "no-repeat",
    width: "100%",
    color: "white"
  },
  [`banner-${SCREEN_SIZES.MOBILE}`]: {
    padding: "5em 1em 1em 2em"
  },
  [`banner-${SCREEN_SIZES.TABLET}`]: {
    padding: "50px 1200px 50px 100px"
  },
  [`banner-${SCREEN_SIZES.DESKTOP}`]: {
    padding: "50px 1200px 50px 100px"
  },
  bannerLink: {
    backgroundColor: colors.primaryBrand,
    color: "white",
    textDecoration: "none",
    padding: "15px 40px",
    borderRadius: "25px",
    boxShadow: "0.12px 2px 0.2px rgba(0, 0, 0, 0.2)",
    display: "block"
  },
  bannerLinkSection: {
    margin: "3em 0",
    display: "flex"
  },
  bannerTitle: {
    lineHeight: "1.2",
    maxWidth: "599px",
    fontWeight: "100"
  },
  bannerSubTitle: {
    marginTop: "1em",
    maxWidth: "599px",
    fontWeight: "100"
  },
  [`bannerTitle-${SCREEN_SIZES.MOBILE}`]: {
    fontSize: "36px",
    maxWidth: "305px"
  },
  [`bannerTitle-${SCREEN_SIZES.TABLET}`]: {
    fontSize: "56px"
  },
  [`bannerTitle-${SCREEN_SIZES.DESKTOP}`]: {
    fontSize: "56px"
  },
  [`bannerSubTitle-${SCREEN_SIZES.MOBILE}`]: {
    fontSize: "16px",
    maxWidth: "305px"
  },
  [`bannerSubTitle-${SCREEN_SIZES.TABLET}`]: {
    fontSize: "16px"
  },
  [`bannerSubTitle-${SCREEN_SIZES.DESKTOP}`]: {
    fontSize: "20px"
  }
});

export default publicInfoStyles;
