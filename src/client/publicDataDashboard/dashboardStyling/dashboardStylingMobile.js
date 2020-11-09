import { createMuiTheme } from "@material-ui/core/styles";

const muiTheme = createMuiTheme({
  dashboard: {
    padding: "20px",
    about: {
      padding: "20px"
    },
    navBar: {
      padding: "0px 4px",
      menuPadding: "24px 0px",
      logoWidth: "54px",
      logoHeight: "66px"
    },
    box: {
      padding: "110px 32px 128px",
      titleMaxWidth: "100%"
    },
    dataSection: {
      padding: "15px"
    }
  }
});

export default muiTheme;
