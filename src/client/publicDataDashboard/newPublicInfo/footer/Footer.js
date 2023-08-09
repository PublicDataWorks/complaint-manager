import { Box, Typography } from "@material-ui/core";
import React from "react";
import TWLogoSM from "./TW_Logo_SM.svg";
import TWLogoLight from "./TW_Logo_light.svg";

const Footer = () => {
  const links = [
    {
      title: "About",
      href: "https://hcsoc.hawaii.gov/about-us/"
    },
    {
      title: "Contact Us",
      href: "https://hcsoc.hawaii.gov/contact-us/"
    },
    {
      title: "Terms of Use",
      href: "https://portal.ehawaii.gov/page/terms-of-use/"
    },
    {
      title: "Accessability",
      href: "https://portal.ehawaii.gov/page/accessibility/"
    }
  ];

  return (
    <section style={{ fontFamily: "Montserrat" }}>
      <Box
        style={{
          height: "220px",
          backgroundColor: "#ECF1F4",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Typography style={{ fontFamily: "inherit" }}>
          Contributor Partner
        </Typography>
        <img
          src={TWLogoSM}
          alt=""
          style={{ maxWidth: "250px", paddingBottom: "16px" }}
        />
        {/* <Typography>
          Thoughtworks a leading global technology consultancy that enables
          enterprises and technology disruptors across the globe to thrive as
          modern digital businesses. We leverage our vast experience to improve
          our clients’ ability to respond to change; utilize data assets; create
          adaptable technology platforms; and rapidly design, deliver and evolve
          exceptional digital products and experiences at scale.
        </Typography> */}
      </Box>
      <Box
        style={{
          height: "280px",
          backgroundColor: "#0A3449",
          color: "FFFFFF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly"
        }}
      >
        <div
          style={{
            width: "85%",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            lineHeight: "30px"
          }}
        >
          {links.map(link => (
            <a
              key={link.title}
              href={link.href}
              target="_blank"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "0 8px"
              }}
            >
              {link.title}
            </a>
          ))}
        </div>
        <div
          style={{
            color: "white",
            width: "80%",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: "Montserrat"
          }}
        >
          <a
            href="https://portal.ehawaii.gov/page/privacy-policy/"
            target="_blank"
            style={{
              padding: "0 8px",
              fontFamily: "inherit",
              color: "white",
              lineHeight: "30px",
              textDecoration: "none"
            }}
          >
            @2023 Privacy Policy{" "}
          </a>
          <a
            href="https://www.thoughtworks.com/"
            target="_blank"
            style={{
              padding: "0 8px",
              fontFamily: "inherit",
              color: "white",
              textDecoration: "none",
              lineHeight: "30px",
              textAlign: "center"
            }}
          >
            Designed and Developed Partnership with
            <img
              src={TWLogoLight}
              alt=""
              style={{ paddingLeft: "5px", marginBottom: "-3px" }}
            />
          </a>
        </div>
      </Box>
    </section>
  );
};

export default Footer;
