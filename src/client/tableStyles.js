const tableStyles = theme => ({
  table: {
    tableMargin: {
      marginLeft: "5%",
      marginRight: "5%",
      marginBottom: "3%"
    },
    labelMargin: {
      marginLeft: "5%"
    }
  },
  header: {
    row: {
      backgroundColor: theme.palette.background.default,
      width: "100%",
      overflowX: "scroll"
    },
    cell: {
      padding: "0 0 0 24px",
      textAlign: "left"
    }
  },
  body: {
    row: {
      backgroundColor: "white",
      borderTop: `8px solid ${theme.palette.background.default}`,
      borderBottom: `8px solid ${theme.palette.background.default}`,
      width: "100%",
      overflowX: "scroll"
    },
    noBorderBottom: {
      borderBottom: "0px"
    },
    noBorderTop: {
      borderTop: "0px"
    },
    cell: {
      padding: "0 0 0 24px",
      textAlign: "left"
    },
    buttonCell: {
      textAlign: "right"
    },
    topAlignCell: {
      padding: "24px 0 24px 24px",
      textAlign: "left",
      verticalAlign: "top"
    }
  }
});

export default tableStyles;
