import React from "react";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { ArrowDropUp } from "@material-ui/icons";

const tooltipStyles = () => ({
  card: {
    border: "6px solid lightgray"
  },
  headerRoot: {
    backgroundColor: "rgb(84, 114, 172)",
    color: "white"
  },
  sectionHeader: {
    fontSize: "1.2em",
    marginTop: "0px"
  },
  examples: {
    display: "flex",
    justifyContent: "space-between",
    margin: "10px 0px",
    flexWrap: "wrap"
  }
});

const SearchTooltip = ({
  arrowLeft,
  arrowWidth,
  top,
  left,
  maxWidth,
  classes
}) => {
  const tooltipHeaderClasses = {
    root: classes.headerRoot
  };

  return (
    <>
      <ArrowDropUp
        style={{
          position: "absolute",
          top: top - 60,
          left: arrowLeft,
          height: 125,
          zIndex: 1,
          width: arrowWidth,
          color: "rgb(84, 114, 172)"
        }}
      />
      <Card
        data-testid="search-tooltip"
        className={classes.card}
        style={{
          position: "absolute",
          top,
          left,
          maxWidth
        }}
      >
        <CardHeader title="Advanced Search" classes={tooltipHeaderClasses} />
        <CardContent>
          <section aria-label="search-terms">
            <h2 className={classes.sectionHeader}>Search Terms</h2>
            <section className="explanation">
              Search terms must be followed by a colon and use quotes for search
              terms containing spaces, dashes, etc.
            </section>
            <section className={classes.examples}>
              <div className="example">
                <strong>complainant:</strong>Smith
              </div>
              <div className="example">
                <strong>accused:</strong>"Adam Smith"
              </div>
              <div className="example">
                <strong>tag:</strong>"Crime Lab"
              </div>
              <div className="example">
                <strong>narrative:</strong>Brutality
              </div>
              <div className="example">
                <strong>narrative.summary:</strong>"Escaped Dog"
              </div>
              <div className="example">
                <strong>narrative.details:</strong>"Walked into oncoming
                traffic"
              </div>
              <div className="example">
                <strong>case_number:</strong>CC2021-0023
              </div>
            </section>
          </section>
          <hr />
          <section aria-label="search-operators">
            <h2 className={classes.sectionHeader}>Search Operators</h2>
            <section className="explanation">
              Use the operators <strong>OR</strong>, <strong>AND</strong>, or{" "}
              <strong>NOT</strong> to refine your search. The default search
              operator is <strong>AND</strong>.
            </section>
            <section className={classes.examples}>
              <div className="example">
                Smith <strong>AND NOT</strong> Jones
              </div>
              <div className="example">
                <strong>accused:</strong>Smith <strong>OR complainant:</strong>
                Smith
              </div>
            </section>
          </section>
          <hr />
          <section aria-label="parentheses-and-quotes">
            <h2 className={classes.sectionHeader}>Parentheses and Quotes</h2>
            <section className="explanation">
              Use parentheses to group your search terms and quotes to search
              for exact matches.
            </section>
            <section className={classes.examples}>
              <div className="example">
                <strong>"</strong>Adam Smith<strong>"</strong>
              </div>
              <div className="example">
                <strong>(</strong>Smith <strong>AND</strong> Jones{" "}
                <strong>) OR (NOT tag:</strong>"Crime Lab"<strong>)</strong>
              </div>
            </section>
          </section>
        </CardContent>
      </Card>
    </>
  );
};

export default withStyles(tooltipStyles, { withTheme: true })(SearchTooltip);
