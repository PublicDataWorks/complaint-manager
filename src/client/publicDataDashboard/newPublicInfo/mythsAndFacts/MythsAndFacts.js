import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ClickAwayListener,
  Typography,
  withStyles
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { mythsAndFactsData } from "./mythsAndFactsData";
import publicInfoStyles from "../publicInfoStyles";

const MythsAndFacts = ({ screenSize, classes }) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = panel => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <section
      className={`${classes.mythsAndFactsContainer} ${
        classes[`mythsAndFactsContainer-${screenSize}`]
      }`}
    >
      <Typography
        variant="h2"
        className={`${classes.navyBackground} ${classes.lightFontColor} ${
          classes[`sectionHeader-${screenSize}`]
        }`}
      >
        MYTHS AND FACTS
      </Typography>
      <ClickAwayListener onClickAway={() => setExpanded(false)}>
        <div>
          {mythsAndFactsData.map(group => (
            <Accordion
              expanded={expanded === group.category}
              onChange={handleChange(group.category)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${group.category}-content`}
                id={`${group.category}-header`}
              >
                <Typography
                  sx={{ width: "33%", flexShrink: 0 }}
                  className={`${classes.forestFontColor} ${classes.statementHeader}`}
                  data-testid={group.category}
                >
                  {group.category}
                </Typography>
              </AccordionSummary>
              <AccordionDetails style={{ flexDirection: "column" }}>
                {group.statements.map(statement => (
                  <div style={{ padding: ".5em 0" }}>
                    <div style={{ display: "flex", width: "100%" }}>
                      <Typography
                        style={{
                          fontFamily: "inherit",
                          fontSize: ".75em",
                          paddingRight: "5px"
                        }}
                      >
                        <strong>Myth: </strong>
                      </Typography>
                      <Typography className={classes.statementFont}>
                        {statement.myth}
                      </Typography>
                    </div>
                    <div style={{ display: "flex" }}>
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
