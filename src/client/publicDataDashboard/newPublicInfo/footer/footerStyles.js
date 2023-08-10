import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import publicInfoStyles, { colors } from "../publicInfoStyles";

const footerStyles = theme => ({
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
  logoImageNavy: {
    paddingBottom: "16px"
  },
  [`logoImageNavy-${SCREEN_SIZES.MOBILE}`]: {
    maxWidth: "250px"
  },
  [`logoImageNavy-${SCREEN_SIZES.TABLET}`]: {
    maxWidth: "300px"
  },
  [`contributorTitle-${SCREEN_SIZES.TABLET}`]: {
    fontSize: "1.25rem"
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
  bottomFooterLinksGroup: {
    width: "85%",
    margin: "0 auto",
    lineHeight: "30px",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center"
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
  partnershipLink: {
    fontFamily: "inherit",
    lineHeight: "30px",
    textAlign: "center"
  },
  [`policyLink-${SCREEN_SIZES.TABLET}`]: {
    paddingRight: "12px",
    lineHeight: "20px",
    borderRight: "1px solid #FFF"
  }
});

export default footerStyles;
