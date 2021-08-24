import colors from "./colors";
import standards from "./standards";

const styles = {
  colors,
  title: {
    color: colors.softBlack,
    fontSize: standards.fontLarge,
    letterSpacing: "1px",
    fontWeight: 500
  },
  subheading: {
    color: colors.textGray,
    fontSize: standards.fontMedium,
    fontWeight: 300
  },
  body1: {
    color: colors.softBlack,
    fontSize: standards.fontSmall,
    fontWeight: 300,
    lineHeight: "22px"
  },
  body2: {
    color: colors.softBlack,
    fontSize: standards.fontSmall,
    fontWeight: 400,
    lineHeight: "22px"
  },
  button: {
    color: colors.softBlack,
    fontSize: standards.fontSmall,
    fontWeight: 400
  },
  display: {
    color: colors.softBlack,
    fontSize: standards.fontMedium,
    fontWeight: 300,
    lineHeight: "28px"
  },
  link: {
    color: "#216DA1",
    fontSize: standards.fontMedium,
    fontWeight: 400,
    textDecoration: "underline"
  },
  navBarLink: {
    color: colors.textGray,
    fontSize: standards.fontSmall,
    fontWeight: 300,
    textDecoration: "none"
  }
};

export default styles;
