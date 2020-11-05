import { createMuiTheme } from "@material-ui/core/styles";

const muiTheme = createMuiTheme({
  dashboard: {
    padding: "64px",
    about: {
      padding: "64px 108px"
    },
    navBar: {
      padding: "48px 0px",
      logoWidth: "132px",
      logoHeight: "120px"
    }
  }
});

export default muiTheme;
