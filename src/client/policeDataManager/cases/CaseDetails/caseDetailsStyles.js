const drawerWidthPercentage = "30%";

const styles = theme => ({
  root: {
    width: "100%",
    zIndex: 1,
    overflow: "hidden"
  },
  appFrame: {
    position: "relative",
    display: "flex",
    width: "100%",
    height: "100%"
  },
  appBar: {
    position: "absolute",
    marginLeft: drawerWidthPercentage,
    width: `calc(100% - ${drawerWidthPercentage})`
  },

  detailsPaneButtons: {
    display: "inlineBlock"
  },

  detailsRow: {
    display: "flex",
    width: "100%",
    paddingRight: 0,
    marginBottom: "26px"
  },

  detailsLastRow: {
    display: "flex",
    width: "100%",
    paddingRight: 0,
    marginBottom: "0px"
  },

  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidthPercentage,
    height: "100%",
    backgroundColor: "white"
  },
  drawerRow: {
    display: "flex",
    marginBottom: "8px",
    flexWrap: "wrap"
  },
  drawerRowEnd: {
    display: "flex",
    marginBottom: "24px",
    flexWrap: "wrap"
  },
  drawerRowItem: {
    flex: 1,
    textAlign: "left",
    minWidth: "100px",
    marginRight: "8px",
    marginBottom: "8px"
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width: "100%",
    padding: theme.spacing(3),
    height: "calc(100% - 56px)",
    marginTop: 56,
    marginLeft: drawerWidthPercentage,
    [theme.breakpoints.up("sm")]: {
      height: "calc(100% - 64px)",
      marginTop: 64
    }
  },
  caseReference: {
    display: "inline",
    verticalAlign: "middle"
  },
  statusBox: {
    padding: "6px 15px 4px 15px",
    borderRadius: "4px",
    margin: "0%",
    marginBottom: "1%",
    marginLeft: "20px",
    display: "inline-block"
  },
  activeStatusBox: {
    backgroundColor: theme.palette.green
  },
  closedStatusBox: {
    backgroundColor: theme.palette.secondary.main
  }
});

export default styles;
