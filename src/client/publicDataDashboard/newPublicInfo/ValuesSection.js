import React from "react";
import { withStyles } from "@material-ui/styles";
import publicInfoStyles from "./publicInfoStyles";
import { Typography } from "@material-ui/core";
const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

export const TITLE = "Your Voice Matters";
export const TEXT =
  "The Correctional Oversight Commission's goal is to increase transparency by showing actual data to the public to support safe conditions for employees, inmates, and detainees and provide positive reform toward a rehabilitative and therapeutic correctional system.";
export const VALUES = [
  {
    name: "Alohiloh",
    subtext: "(Transparency)",
    icon: `${config.frontendUrl}/images/Alohiloh.svg`
  },
  {
    name: "Kuleana",
    subtext: "(Accountability)",
    icon: `${config.frontendUrl}/images/Kuleana.svg`
  },
  {
    name: "Pono",
    subtext: "(Integrity)",
    icon: `${config.frontendUrl}/images/Pono.svg`
  },
  {
    name: "Aloha",
    subtext: "(Compassion)",
    icon: `${config.frontendUrl}/images/Aloha.svg`
  },
  {
    name: "Ha'aha'a",
    subtext: "(Humility)",
    icon: `${config.frontendUrl}/images/Haahaa.svg`
  }
];

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
      <section className={props.classes.valueIconsSection}>
        {VALUES.map(value => (
          <figure
            key={value.name}
            style={{ margin: "15px 10px", minWidth: "120px" }}
          >
            <div className={props.classes.valueIcon}>
              <img alt={value.name} src={value.icon} />
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
