import React from "react";
import { withStyles } from "@material-ui/styles";
import publicInfoStyles from "./publicInfoStyles";
import { Typography } from "@material-ui/core";

export const TITLE = "Your Voice Matters";
export const TEXT =
  "Our goal is to use this platform to serve the community, leaders, and legislators to ensure transparency and accountability, support safe conditions for staff and those in custody in the jails and prisons, and implement positive reform and rehabilitative efforts to show real data outcomes to better public safety.";
const VALUES = [];

const ValuesSection = props => {
  return (
    <section
      className={`${props.classes.valuesSection} ${
        props.classes[`valuesSection-${props.screenSize}`]
      }`}
    >
      <Typography variant="h2" className={props.classes.h2}>
        {TITLE}
      </Typography>
      <Typography className={props.classes.body}>{TEXT}</Typography>
    </section>
  );
};

export default withStyles(publicInfoStyles)(ValuesSection);
