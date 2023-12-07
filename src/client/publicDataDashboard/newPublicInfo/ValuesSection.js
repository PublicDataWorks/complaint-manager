import React from "react";
import { withStyles } from "@material-ui/styles";
import publicInfoStyles from "./publicInfoStyles";
import Typography from "@material-ui/core/Typography";
import { TEXT, VALUES } from "./ValuesSectionData.js";

const ValuesSection = props => {
  return (
    <section
      id="values"
      className={`${props.classes.valuesSection} ${
        props.classes[`valuesSection-${props.screenSize}`]
      }`}
    >
      <Typography className={props.classes.body}>{TEXT}</Typography>
      <section className={props.classes.valueIconsSection}>
        {VALUES.map(value => (
          <figure key={value.name} className={props.classes.valuesFigure}>
            <div className={props.classes.valueIcon}>
              <img alt={value.altText} src={value.icon} />
            </div>
            <figcaption className={props.classes.valueFigureCaption}>
              <span>{value.name}</span>
              <span>{value.subtext}</span>
            </figcaption>
          </figure>
        ))}
      </section>
    </section>
  );
};

export default withStyles(publicInfoStyles)(ValuesSection);
