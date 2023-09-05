import { SCREEN_SIZES } from "../../../sharedUtilities/constants";
const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

export const colors = {
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
  gradientLight: "rgba(29, 39, 45, 0)",
  gradientDarkHalfOpacity: "rgba(19, 35, 45, 0.5)"
};

const images = {
  banner: `${config.frontendUrl}/images/Hawaii-Hero_banner.png` //need to find correct url
};

const publicInfoStyles = theme => ({
  h2: {
    fontSize: "32px",
    letterSpacing: "-2%",
    margin: "1em 0",
    fontFamily: "inherit"
  },
  body: {
    lineHeight: "150%",
    fontFamily: "inherit"
  },
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
  [`menuLink-${SCREEN_SIZES.TABLET}`]: {
    padding: "0px 16px",
    textAlign: "center"
  },
  menuBorderLeft: {
    borderLeft: "solid 1px #bbbcbd"
  },
  bannerSection: {
    background: `linear-gradient(to bottom right, ${colors.gradientDark}, ${colors.gradientLight}), url(${images.banner});`,
    backgroundRepeat: "no-repeat",
    width: "100%",
    color: "white"
  },
  [`bannerSection-${SCREEN_SIZES.MOBILE}`]: {
    background: `linear-gradient(to bottom right, ${colors.gradientDarkHalfOpacity}, ${colors.gradientDarkHalfOpacity}), url(${images.banner});`,
    backgroundPositionX: "-1150px"
  },
  [`bannerTextWrapper-${SCREEN_SIZES.MOBILE}`]: {
    padding: "3.5em 1em 0 2.5em"
  },
  [`bannerTextWrapper-${SCREEN_SIZES.TABLET}`]: {
    padding: "3em 1.5em 0 3em"
  },
  [`bannerTextWrapper-${SCREEN_SIZES.DESKTOP}`]: {
    padding: "3.5em 1.5em 0 6em"
  },
  bannerTitle: {
    fontFamily: "Montserrat",
    lineHeight: "1.2",
    maxWidth: "900px"
  },
  [`bannerTitle-${SCREEN_SIZES.MOBILE}`]: {
    fontSize: "36px",
    maxWidth: "305px"
  },
  [`bannerTitle-${SCREEN_SIZES.TABLET}`]: {
    fontSize: "46px"
  },
  [`bannerTitle-${SCREEN_SIZES.DESKTOP}`]: {
    fontSize: "56px"
  },
  bannerSubTitle: {
    paddingTop: "1em",
    fontWeight: "400",
    fontFamily: "inherit",
    letterSpacing: "0.5px"
  },
  [`bannerSubTitle-${SCREEN_SIZES.MOBILE}`]: {
    fontSize: "14px",
    maxWidth: "305px",
    lineHeight: "22px"
  },
  [`bannerSubTitle-${SCREEN_SIZES.TABLET}`]: {
    fontSize: "16px",
    maxWidth: "599px",
    lineHeight: "24px"
  },
  [`bannerSubTitle-${SCREEN_SIZES.DESKTOP}`]: {
    paddingTop: "2em",
    fontSize: "16px",
    maxWidth: "800px",
    lineHeight: "36px"
  },
  bannerLink: {
    backgroundColor: colors.secondaryBrand,
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
  [`bannerLinkSection-${SCREEN_SIZES.MOBILE}`]: {
    margin: "0",
    padding: "2.75em 0"
  },
  [`bannerLinkSection-${SCREEN_SIZES.TABLET}`]: {
    margin: "0",
    padding: "2em 0"
  },
  [`bannerLinkSection-${SCREEN_SIZES.DESKTOP}`]: {
    margin: "0",
    padding: "2em 0 5em"
  },

  valuesSection: {
    alignItems: "center",
    textAlign: "center",
    maxWidth: "1050px",
    padding: "16px"
  },
  [`valuesSection-${SCREEN_SIZES.DESKTOP}`]: {
    margin: "1.5em auto",
    padding: "2% 10% 0 10%"
  },
  [`valuesSection-${SCREEN_SIZES.TABLET}`]: {
    margin: "1.5em 4em"
  },
  [`valuesSection-${SCREEN_SIZES.MOBILE}`]: {
    margin: "1.5em"
  },
  valueIcon: {
    backgroundColor: colors.secondaryBrand,
    width: "70px",
    height: "70px",
    borderRadius: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "10px auto"
  },
  valueIconsSection: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "space-around",
    marginTop: "2em"
  },

  greyBackground: {
    backgroundColor: colors.accent
  },
  navyBackground: {
    backgroundColor: colors.primaryBrand
  },
  forestBackground: {
    backgroundColor: colors.secondaryBrand
  },
  lightFontColor: {
    color: colors.light
  },
  forestFontColor: {
    color: colors.secondaryBrand
  },
  [`sectionHeader-${SCREEN_SIZES.MOBILE}`]: {
    fontFamily: "inherit",
    fontSize: "1.5em",
    textAlign: "center",
    padding: "1.5em"
  },
  [`sectionHeader-${SCREEN_SIZES.TABLET}`]: {
    fontFamily: "inherit",
    fontSize: "1.5em",
    padding: "1.5em 0.65em",
    textAlign: "left"
  },
  [`sectionHeader-${SCREEN_SIZES.DESKTOP}`]: {
    fontFamily: "inherit",
    fontSize: "1.5em",
    padding: "1.5em 0.65em",
    textAlign: "left"
  },
  statementHeader: {
    fontFamily: "inherit",
    fontWeight: "500",
    fontSize: "1em",
    letterSpacing: ".15px"
  },
  statementFont: {
    fontFamily: "inherit",
    fontSize: ".75em"
  },
  mythsAndFactsContainer: {
    padding: "16px 0"
  },
  [`mythsAndFactsContainer-${SCREEN_SIZES.MOBILE}`]: {
    margin: "1.5em"
  },
  [`mythsAndFactsContainer-${SCREEN_SIZES.TABLET}`]: {
    margin: "1.5em"
  },
  [`mythsAndFactsContainer-${SCREEN_SIZES.DESKTOP}`]: {
    margin: "4.5em 7em"
  }
});

export default publicInfoStyles;
