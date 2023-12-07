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
                  className={classes.mythsStatementHeader}
                  data-testid={group.category}
                >
                  {group.category}
                </Typography>
              </AccordionSummary>
              <AccordionDetails style={{ flexDirection: "column" }}>
                {group.statements.map(statement => (
                  <div key={statement.id} style={{ padding: ".5em 0" }}>
                    <div className={classes.mythsContentContainer}>
                      <Typography className={classes.mythsHeader}>
                        {statement.id}. Myth:
                      </Typography>
                      <Typography style={{ fontFamily: "inherit" }}>
                        {statement.myth}
                      </Typography>
                    </div>
                    <div className={classes.factsContentContainer}>
                      <Typography className={classes.factsHeader}>
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
