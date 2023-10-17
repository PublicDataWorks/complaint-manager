import React from "react";
import { withStyles } from "@material-ui/styles";
import publicInfoStyles from "./publicInfoStyles";
import { Typography } from "@material-ui/core";
const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

export const TEXT =
  "The Hawaii Correctional System Oversight Commission's goal is to increase transparency by making data available to the public to support safe conditions for employees and people in custody, and to push for reform to a rehabilitative and therapeutic correctional system. Below are our values:";
export const VALUES = [
  {
    name: "Alohiloh",
    subtext: "(Transparency)",
    icon: `${config.frontendUrl}/images/Alohiloh.svg`,
    altText: "white outline of three people holding hands in a circle"
  },
  {
    name: "Kuleana",
    subtext: "(Accountability)",
    icon: `${config.frontendUrl}/images/Kuleana.svg`,
    altText:
      "white outline of three people shoulder to shoulder celebrating with their hands up"
  },
  {
    name: "Pono",
    subtext: "(Integrity)",
    icon: `${config.frontendUrl}/images/Pono.svg`,
    altText: "white outline of hibiscus flower"
  },
  {
    name: "Aloha",
    subtext: "(Compassion)",
    icon: `${config.frontendUrl}/images/Aloha.svg`,
    altText: "white outline of shaka or hang loose hand gesture"
  },
  {
    name: "Ha'aha'a",
    subtext: "(Humility)",
    icon: `${config.frontendUrl}/images/Haahaa.svg`,
    altText: "white outline of five smiley faces connected by eight lines"
  }
];

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
          <figure
            key={value.name}
            style={{ margin: "15px 10px", minWidth: "120px" }}
          >
            <div className={props.classes.valueIcon}>
              <img alt={value.altText} src={value.icon} />
            </div>
            <figcaption
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "0.5em"
              }}
            >
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
