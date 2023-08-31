import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";
import publicInfoStyles, { colors } from "../publicInfoStyles";

const dataVisStyles = theme => ({
  ...publicInfoStyles(theme),

  dataSectionWrapper: {
    height: "fit-content",
    margin: "1.5em",
    padding: "16px 0",
    fontFamily: "Montserrat"
  },
  [`dataSectionWrapper-${SCREEN_SIZES.DESKTOP}`]: {
    margin: "4.5em 7em"
  },
  dataSectionTitle: {
    fontFamily: "inherit",
    fontSize: "32px",
    fontWeight: "300"
  },
  /* CATEGORY DROPDOWN & LIST */
  categoryWrapper: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-start"
  },
  [`categoryWrapper-${SCREEN_SIZES.DESKTOP}`]: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  categoryListWrapper: {
    height: "fit-content",
    width: "20%",
    minWidth: "180px",
    maxWidth: "300px",
    margin: "50px 5% 0 0"
  },
  categoryButtonTitle: {
    width: "211px",
    fontFamily: "inherit",
    fontSize: "20px",
    fontWeight: "400",
    letterSpacing: "-.25px",
    color: "black",
    textTransform: "none",
    borderRadius: "0",
    borderColor: colors.accent,
    backgroundColor: colors.accent,
    display: "flex",
    justifyContent: "space-between"
  },
  [`categoryButtonTitle-${SCREEN_SIZES.DESKTOP}`]: {
    width: "100%",
    padding: "10px 2px 10px 18px",
    borderBottom: "1px solid rgb(34, 118, 124)",
    boxShadow: "0px 4px 4px 0px #00000040"
  },
  categoryButtonGroup: {
    width: "100%",
    padding: "0 10px",
    borderRadius: "0",
    backgroundColor: colors.accent,
    boxShadow: "0px 4px 4px 0px #00000040"
  },
  categoryButton: {
    padding: "12px 8px",
    fontFamily: "inherit",
    fontWeight: "500",
    letterSpacing: ".15px",
    textTransform: "none",
    justifyContent: "space-between"
  },
  active: {
    color: colors.secondaryBrand
  },
  /* GRAPH */
  graphInfoContainer: {
    height: "fit-content",
    width: "100%",
    marginTop: "28px",
    fontFamily: "inherit",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },
  [`graphInfoContainer-${SCREEN_SIZES.DESKTOP}`]: {
    height: "90%",
    width: "75%",
    marginTop: "10px"
  },
  graphCategoryTitle: {
    width: "96vw",
    marginLeft: "-16px",
    fontFamily: "inherit",
    fontSize: "24px",
    fontWeight: "700",
    textAlign: "center"
  },
  [`graphCategoryTitle-${SCREEN_SIZES.DESKTOP}`]: {
    width: "100%",
    margin: "0"
  },
  graphCategoryDescription: {
    padding: "8px",
    fontFamily: "inherit",
    fontSize: "16px",
    fontWeight: "400",
    lineHeight: "22.4px",
    textAlign: "center",
    alignSelf: "center"
  },
  [`graphCategoryDescription-${SCREEN_SIZES.DESKTOP}`]: {
    height: "fit-content",
    width: "85%",
    margin: "0",
    padding: "4px 8px"
  },
  graphWrapper: {
    height: "100%",
    padding: "20px 0"
  },
  [`graphWrapper-${SCREEN_SIZES.MOBILE}`]: {
    width: "100%"
  },
  sourceText: {
    paddingTop: "16px",
    fontFamily: "inherit",
    fontSize: "14px",
    fontWeight: "400"
  },
  [`sourceText-${SCREEN_SIZES.TABLET}`]: {
    padding: "16px 16px 0"
  },
  [`sourceText-${SCREEN_SIZES.DESKTOP}`]: {
    paddingLeft: "16px"
  },
  /* DEMOGRAPHICS RADIAL CHART */
  radialChartWrapper: {
    display: "flex",
    flexDirection: "column",
    width: "180px",
    alignItems: "center",
    marginRight: "15px"
  },
  [`radialChartWrapper-${SCREEN_SIZES.MOBILE}`]: {
    width: "150px"
  },
  demographicLegend: {
    fontSize: "x-large",
    display: "flex",
    flexWrap: "wrap",
    padding: "0%"
  },
  [`demographicLegend-${SCREEN_SIZES.MOBILE}`]: {
    margin: 0,
    justifyContent: "flex-start"
  },
  [`demographicLegend-${SCREEN_SIZES.TABLET}`]: {
    width: "80%",
    margin: "auto",
    justifyContent: "space-around"
  },
  [`demographicLegend-${SCREEN_SIZES.DESKTOP}`]: {
    width: "80%",
    maxWidth: "600px",
    margin: "auto",
    justifyContent: "space-evenly"
  }
});

export default dataVisStyles;
