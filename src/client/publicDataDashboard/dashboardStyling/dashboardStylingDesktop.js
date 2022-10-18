import { createTheme } from "@material-ui/core/styles";

const muiTheme = createTheme({
  dashboard: {
    padding: "64px",
    about: {
      padding: "64px 108px"
    },
    glossary: {
      padding: "64px 108px"
    },
    navBar: {
      menuPadding: "48px 0px",
      logoWidth: "132px",
      logoHeight: "120px"
    },
    box: {
      padding: "110px 64px 128px",
      titleMaxWidth: "65%"
    },
    dataSection: {
      padding: "0px"
    }
  }
});

export default muiTheme;
