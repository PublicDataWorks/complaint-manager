import React, { useState } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { mythsAndFactsData } from "./mythsAndFactsData";
import publicInfoStyles from "../publicInfoStyles";
import { colors } from "../publicInfoStyles";

const MythsAndFacts = ({ screenSize, classes }) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = panel => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <section
      id="myths-and-facts"
      className={`${classes.mythsAndFactsContainer} ${
        classes[`mythsAndFactsContainer-${screenSize}`]
      }`}
    >
      <Typography
        variant="h2"
        className={`${classes.sectionHeader} ${
          classes[`sectionHeader-${screenSize}`]
        }`}
      >
        MYTHS AND FACTS
      </Typography>
      <ClickAwayListener onClickAway={() => setExpanded(false)}>
        <div>
          {mythsAndFactsData.map(group => (
            <Accordion
              key={group.category}
              expanded={expanded === group.category}
              onChange={handleChange(group.category)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${group.category}-content`}
                id={`${group.category.replace(" ", "-")}-header`}
              >
                <Typography
                  sx={{ width: "33%", flexShrink: 0 }}
                  className={classes.statementHeader}
                  data-testid={group.category}
                >
                  {group.category}
                </Typography>
              </AccordionSummary>
              <AccordionDetails style={{ flexDirection: "column" }}>
                {group.statements.map(statement => (
                  <div key={statement.id} style={{ padding: ".5em 0" }}>
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        padding: "10px",
                        fontSize: "1em"
                      }}
                    >
                      <Typography
                        style={{
                          fontFamily: "inherit",
                          paddingRight: "5px",
                          color: colors.secondaryBrand,
                          fontWeight: "550",
                          minWidth: "70px"
                        }}
                      >
                        {statement.id}. Myth:
                      </Typography>
                      <Typography
                        style={{
                          fontFamily: "inherit"
                        }}
                      >
                        {statement.myth}
                      </Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        backgroundColor: `${colors.accent}`,
                        padding: "10px"
                      }}
                    >
                      <Typography
                        style={{
                          fontFamily: "inherit",
                          fontSize: ".75em",
                          paddingRight: "9px"
                        }}
                      >
                        <strong>Fact: </strong>
                      </Typography>
                      <Typography className={classes.statementFont}>
                        {statement.fact}
                      </Typography>
                    </div>
                  </div>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </ClickAwayListener>
    </section>
  );
};

export default withStyles(publicInfoStyles)(MythsAndFacts);
