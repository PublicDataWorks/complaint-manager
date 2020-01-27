import colors from "./colors";
import standards from "./standards";

const styles = {
  title: {
    color: colors.primary.main,
    fontSize: standards.fontLarge,
    fontWeight: 400
  },
  subheading: {
    color: colors.secondary.dark,
    fontSize: standards.fontMedium,
    fontWeight: 400
  },
  body1: {
    color: colors.secondary.dark,
    fontSize: standards.fontSmall,
    fontWeight: 400
  },
  caption: {
    color: colors.secondary.main,
    fontSize: standards.fontTiny,
    fontWeight: 400
  },
  button: {
    fontSize: standards.fontSmall,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1.4px"
  },
  display1: {
    color: colors.secondary.main,
    fontSize: standards.fontTiny,
    fontWeight: 400,
    fontStyle: "italic"
  },
  link: {
    color: colors.blue,
    fontSize: standards.fontSmall,
    fontWeight: 700,
    textDecoration: "none"
  },
  section: {
    color: colors.secondary.dark,
    fontSize: standards.fontMedium,
    fontWeight: 700,
    textTransform: "uppercase"
  },
  colors: colors,
  inputLabel: {
    color: colors.secondary.medium,
    fontSize: standards.fontTiny
  },
  floatingCard: {
    boxShadow:
      "0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12)"
  },
  cardStyling: {
    backgroundColor: "white",
    marginBottom: "24px"
  },
  appBarStyle: {
    position: "static",
    width: "100%"
  },
  drawer: {
    width: 550
  }
};

export default styles;
