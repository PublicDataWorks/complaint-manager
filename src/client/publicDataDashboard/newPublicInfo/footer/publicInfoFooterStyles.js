import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import publicInfoStyles, { colors } from "../publicInfoStyles";

const publicInfoFooterStyles = theme => ({
  ...publicInfoStyles(theme),

  contributorSectionWrapper: {
    backgroundColor: colors.accent,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  [`contributorSectionWrapper-${SCREEN_SIZES.MOBILE}`]: {
    height: "220px"
  },
  [`contributorSectionWrapper-${SCREEN_SIZES.TABLET}`]: {
    height: "fit-content",
    padding: "16px"
  },
  [`contributorSectionWrapper-${SCREEN_SIZES.DESKTOP}`]: {
    height: "384px",
    padding: "16px"
  },
  logoImageNavy: {
    paddingBottom: "16px"
  },
  [`logoImageNavy-${SCREEN_SIZES.MOBILE}`]: {
    maxWidth: "250px"
  },
  [`logoImageNavy-${SCREEN_SIZES.TABLET}`]: {
    maxWidth: "300px"
  },
  [`logoImageNavy-${SCREEN_SIZES.DESKTOP}`]: {
    maxWidth: "400px"
  },
  [`contributorTitle-${SCREEN_SIZES.MOBILE}`]: {
    paddingBottom: "5px",
    fontSize: "1.2rem"
  },
  [`contributorTitle-${SCREEN_SIZES.TABLET}`]: {
    fontSize: "1.45rem"
  },
  [`contributorTitle-${SCREEN_SIZES.DESKTOP}`]: {
    fontSize: "1.75rem"
  },
  contributorDescription: {
    width: "90%",
    padding: "0 16px 16px",
    fontFamily: "inherit",
    fontWeight: "400",
    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "center"
  },
  [`contributorDescription-${SCREEN_SIZES.DESKTOP}`]: {
    width: "80%"
  },
  bottomFooterSectionWrapper: {
    color: "#FFF",
    backgroundColor: colors.primaryBrand,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly"
  },
  [`bottomFooterSectionWrapper-${SCREEN_SIZES.MOBILE}`]: {
    height: "280px",
    justifyContent: "space-evenly"
  },
  [`bottomFooterSectionWrapper-${SCREEN_SIZES.TABLET}`]: {
    height: "136px",
    justifyContent: "center"
  },
  [`bottomFooterSectionWrapper-${SCREEN_SIZES.DESKTOP}`]: {
    height: "130px",
    flexDirection: "row",
    alignItems: "center"
  },
  bottomFooterLinksGroup: {
    width: "85%",
    margin: "0 auto",
    lineHeight: "30px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  [`bottomFooterLinksGroup-${SCREEN_SIZES.DESKTOP}`]: {
    width: "fit-content",
    margin: "0"
  },
  link: {
    padding: "0 8px",
    color: "#FFF",
    textDecoration: "none"
  },
  [`link-${SCREEN_SIZES.TABLET}`]: {
    padding: "0 16px"
  },
  partnershipLinksWrapper: {
    margin: "0 auto",
    fontFamily: "Montserrat",
    color: "#FFF",
    display: "flex",
    alignItems: "center"
  },
  [`partnershipLinksWrapper-${SCREEN_SIZES.MOBILE}`]: {
    width: "80%",
    flexDirection: "column"
  },
  [`partnershipLinksWrapper-${SCREEN_SIZES.TABLET}`]: {
    margin: "12px auto 0"
  },
  [`partnershipLinksWrapper-${SCREEN_SIZES.DESKTOP}`]: {
    margin: "0"
  },
  partnershipLink: {
    fontFamily: "inherit",
    lineHeight: "30px",
    textAlign: "center"
  },
  [`policyLink-${SCREEN_SIZES.TABLET}`]: {
    paddingRight: "12px",
    lineHeight: "20px",
    borderRight: "1px solid #FFF"
  },
  [`policyLink-${SCREEN_SIZES.DESKTOP}`]: {
    paddingRight: "12px",
    lineHeight: "20px",
    borderRight: "1px solid #FFF"
  }
});

export default publicInfoFooterStyles;
