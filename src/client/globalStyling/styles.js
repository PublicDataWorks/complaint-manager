import colors from "./colors";

const styles = {
  title: {
    color: colors.primary.main,
    fontSize: "1.3rem",
    fontWeight: 400
  },
  subheading: {
    color: colors.secondary.dark,
    fontSize: "1rem",
    fontWeight: 400
  },
  body1: {
    color: colors.secondary.dark,
    fontSize: "0.875rem",
    fontWeight: 400
  },
  caption: {
    color: colors.secondary.main,
    fontSize: "0.75rem",
    fontWeight: 400
  },
  button: {
    fontSize: "0.875rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1.4px"
  },
  display1: {
    color: colors.secondary.main,
    fontSize: "0.75rem",
    fontWeight: 400,
    fontStyle: "italic"
  },
  link: {
    color: colors.blue,
    fontSize: "0.875rem",
    fontWeight: 700,
    textDecoration: "none"
  },
  section: {
    color: colors.secondary.dark,
    fontSize: "1rem",
    fontWeight: 700,
    textTransform: "uppercase"
  },
  colors: colors,
  inputLabel: {
    color: colors.secondary.medium,
    fontSize: "0.75rem"
  },
  floatingCard: {
    boxShadow:
      "0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12)"
  }
};

export default styles;
