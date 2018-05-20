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
      backgroundColor: theme.palette.secondary.lighter,
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
      height: 80,
      backgroundColor: "white",
      borderTop: `8px solid ${theme.palette.secondary.lighter}`,
      borderBottom: `8px solid ${theme.palette.secondary.lighter}`,
      width: "100%",
      overflowX: "scroll"
    },
    cell: {
      padding: "0 0 0 24px",
      textAlign: "left"
    },
    topAlignCell: {
      padding: "24px 0 24px 24px",
      textAlign: "left",
      verticalAlign: "top"
    }
  }
});

export default tableStyles;
