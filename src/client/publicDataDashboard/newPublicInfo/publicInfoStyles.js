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
    padding: "5em 1em 1em 2em",
    background: `linear-gradient(to bottom right, ${colors.gradientDarkHalfOpacity}, ${colors.gradientDarkHalfOpacity}), url(${images.banner});`,
    backgroundPositionX: "-1150px"
  },
  [`banner-${SCREEN_SIZES.TABLET}`]: {
    padding: "50px 1200px 50px 100px"
  },
  [`banner-${SCREEN_SIZES.DESKTOP}`]: {
    padding: "50px 1200px 50px 100px"
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
  bannerTitle: {
    lineHeight: "1.2",
    maxWidth: "599px",
    fontWeight: "100"
  },
  bannerSubTitle: {
    marginTop: "1em",
    maxWidth: "599px",
    fontWeight: "100",
    fontFamily: "inherit"
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
  },
  valuesSection: {
    alignItems: "center",
    textAlign: "center",
    maxWidth: "1150px"
  },
  [`valuesSection-${SCREEN_SIZES.DESKTOP}`]: {
    margin: "1em auto"
  },
  [`valuesSection-${SCREEN_SIZES.TABLET}`]: {
    margin: "1em 4em"
  },
  [`valuesSection-${SCREEN_SIZES.MOBILE}`]: {
    margin: "1em 1.5em"
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
  staffingShortageContainer: {
    margin: "1.5em"
  },
  staffingShortageSubHeader: {
    color: colors.secondaryBrand,
    fontSize: "28px",
    margin: "0px"
  },
  [`staffingShortageGrid-${SCREEN_SIZES.MOBILE}`]: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "0.75fr repeat(6, 0.75fr)",
    gridColumnGap: "0px",
    gridRowGap: "0px",
    marginTop: "0.75em"
  },
  [`staffingShortageGrid-${SCREEN_SIZES.TABLET}`]: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridTemplateRows: "repeat(4, 200px)",
    gridColumnGap: "0px",
    gridRowGap: "0px",
    marginTop: "0.75em"
  },
  [`staffingShortageGrid-${SCREEN_SIZES.DESKTOP}`]: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gridTemplateRows: "repeat(2, 200px)",
    gridColumnGap: "0px",
    gridRowGap: "0px",
    marginTop: "0.75em"
  },
  hawaiiMapImg: {
    gridArea: "1 / 2 / 3 / 4"
  },
  imgOverHawaiiMap: {
    gridArea: "2 / 2 / 3 / 3"
  },
  inPrisonImg: {
    gridArea: "3 / 2 / 5 / 4"
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
  }
});

export default publicInfoStyles;
