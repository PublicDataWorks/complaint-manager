import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  withStyles
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { mythsAndFactsData } from "./mythsAndFactsData";
import publicInfoStyles from "../publicInfoStyles";

const styles = {};

const MythsAndFacts = props => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = panel => isExpanded => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <section style={{ margin: "1.5em" }}>
      <Typography
        variant="h2"
        style={{
          fontFamily: "inherit",
          fontSize: "1.5em",
          textAlign: "center",
          padding: "1.5em"
        }}
        className={`${props.classes.navyBackground} ${props.classes.lightFontColor}`}
      >
        Myths and Facts
      </Typography>
      <div>
        {mythsAndFactsData.map(group => (
          <Accordion
            expanded={expanded === group.category}
            onChange={handleChange(group.category)}
          >
            <AccordionSummary
              expandIcon={<AddIcon />}
              aria-controls={`${group.category}-content`}
              id={`${group.category}-header`}
            >
              <Typography
                sx={{ width: "33%", flexShrink: 0 }}
                style={{
                  fontFamily: "inherit",
                  fontWeight: "500",
                  fontSize: "1em",
                  letterSpacing: ".15px"
                }}
                className={props.classes.forestFontColor}
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
                    <Typography
                      style={{ fontFamily: "inherit", fontSize: ".75em" }}
                    >
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
                    <Typography
                      style={{ fontFamily: "inherit", fontSize: ".75em" }}
                    >
                      {statement.fact}
                    </Typography>
                  </div>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </section>
  );
};

export default withStyles(publicInfoStyles)(MythsAndFacts);
