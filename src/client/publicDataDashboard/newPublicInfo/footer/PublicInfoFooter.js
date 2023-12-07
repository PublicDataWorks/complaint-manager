import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import publicInfoFooterStyles from "./publicInfoFooterStyles";
import TWLogoSM from "./TW_Logo_SM.svg";
import TWLogoMDLG from "./TW_Logo_MDLG.svg";
import TWLogoLight from "./TW_Logo_light.svg";
import { SCREEN_SIZES } from "../../../../sharedUtilities/constants";

const PublicInfoFooter = ({ classes, screenSize }) => {
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
        className={`${classes.contributorSectionWrapper} ${
          classes[`contributorSectionWrapper-${screenSize}`]
        }`}
      >
        <a
          href="https://www.thoughtworks.com/about-us/social-change"
          target="_blank"
          className={classes.footerLogoLink}
        >
          <Typography
            variant="h2"
            className={`${classes[`contributorTitle-${screenSize}`]}`}
            style={{
              fontFamily: "inherit"
            }}
          >
            Contributor Partner
          </Typography>
          <img
            src={screenSize === SCREEN_SIZES.MOBILE ? TWLogoSM : TWLogoMDLG}
            alt="Thoughtworks logo in navy"
            className={`${classes.logoImageNavy} ${
              classes[`logoImageNavy-${screenSize}`]
            }`}
          />
        </a>
        {screenSize === SCREEN_SIZES.MOBILE ? null : (
          <Typography
            variant="body1"
            className={`${classes.contributorDescription} ${
              classes[`contributorDescription-${screenSize}`]
            }`}
          >
            Thoughtworks is a leading global technology consultancy that enables
            enterprises and technology disruptors across the globe to thrive as
            modern digital businesses. We leverage our vast experience to
            improve our clients’ ability to respond to change; utilize data
            assets; create adaptable technology platforms; and rapidly design,
            deliver and evolve exceptional digital products and experiences at
            scale.
          </Typography>
        )}
      </Box>
      <Box
        className={`${classes.bottomFooterSectionWrapper} ${
          classes[`bottomFooterSectionWrapper-${screenSize}`]
        }`}
      >
        <div
          className={`${classes.bottomFooterLinksGroup} ${
            classes[`bottomFooterLinksGroup-${screenSize}`]
          }`}
        >
          {links.map(link => (
            <a
              key={link.title}
              href={link.href}
              target="_blank"
              className={`${classes.link} ${classes[`link-${screenSize}`]}`}
            >
              {link.title}
            </a>
          ))}
        </div>
        <div
          className={`${classes.partnershipLinksWrapper} ${
            classes[`partnershipLinksWrapper-${screenSize}`]
          }`}
        >
          <a
            href="https://portal.ehawaii.gov/page/privacy-policy/"
            target="_blank"
            className={`${classes.link} ${classes.partnershipLink} ${
              classes[`policyLink-${screenSize}`]
            }`}
          >
            @2023 Privacy Policy
          </a>
          <a
            href="https://www.thoughtworks.com/"
            target="_blank"
            className={`${classes.link} ${classes.partnershipLink}`}
          >
            Designed and Developed Partnership with
            <img
              src={TWLogoLight}
              alt="Thoughtworks logo in white"
              className={classes.partnershipLogoImage}
            />
          </a>
        </div>
      </Box>
    </section>
  );
};

export default withStyles(publicInfoFooterStyles)(PublicInfoFooter);
