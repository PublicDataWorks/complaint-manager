import React, { Component } from "react";
import { Typography, Grid, Button, Icon, Container, Link } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import dashboardStyling from "./dashboardStyling/dashboardStyling";
import styles from "./dashboardStyling/styles";
import TextTruncate from "../complaintManager/shared/components/TextTruncate";

const scrollIntoViewById = selector => event => {
  const target = event.target.ownerDocument || document;
  const anchorElement = target.querySelector(selector);
  if (!anchorElement) return;

  anchorElement.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
};

class PublicDataDashboard extends Component {
  render() {
    return (
      <MuiThemeProvider theme={dashboardStyling}>
        <Grid
          container
          spacing={3}
          style={{ padding: "64px", backgroundColor: "white" }}
        >
          <Grid item xs={8} style={{ marginBottom: "22px" }}>
            <img
              src="/favicon.ico"
              style={{ width: "132px", height: "120px" }}
            />
          </Grid>
          <Grid item xs={4} style={{ padding: 0 }}>
            <Container
              style={{
                display: "flex",
                padding: "48px 0px",
                alignItems: "center",
                justifyContent: "flex-end"
              }}
            >
              <Typography style={styles.navBarLink}>About</Typography>
              <Typography
                style={{
                  paddingLeft: "32px",
                  color: styles.navBarLink.color,
                  fontSize: styles.navBarLink.fontSize,
                  fontWeight: styles.navBarLink.fontWeight
                }}
              >
                Glossary
              </Typography>
            </Container>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h3">
        The
      {" "}
        <Link href="https://nolaipm.gov/" style={styles.link}>
        Office of the Independent Police Monitor
      </Link>
        {" "}
              (OIPM) is sharing data with the public to increase transparency to
              inform and empower the community the office was designed to serve.
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="body1">
              The Office of the Independent Police Monitor receives
              commendations and complaints, monitors and reviews misconduct
              complaint investigations and disciplinary proceedings, and keeps
              data on relevant trends and patterns to communicate back to the
              NOPD through policy and practice recommendations.
            </Typography>
            <br />
            <Typography variant="body2">
              This dashboard showcases data visualizations regarding the
              complaint process and complaints the Office of the Independent
              Police Monitor received directly.
            </Typography>
          </Grid>
          <Grid item xs={12} style={{ paddingBottom: "116px" }}>
            <Container
              style={{
                padding: 0,
                margin: 0,
                flexDirection: "column",
                alignItems: "center",
                display: "flex",
                maxWidth: "220px"
              }}
            >
              <Button
                variant="contained"
                onClick={scrollIntoViewById("#complaints-over-time-link")}
                style={{
                  textTransform: "none",
                  padding: "16px 48px",
                  borderRadius: 0,
                  boxShadow: "none",
                  backgroundColor: styles.colors.buttonGray,
                  marginBottom: "4px"
                }}
              >
                <Typography variant="body1">Explore the data</Typography>
              </Button>
              <Icon
                style={{
                  transform: "rotate(90deg)",
                  color: styles.colors.iconGray
                }}
                onClick={scrollIntoViewById("#complaints-over-time-link")}
              >
                double_arrow
              </Icon>
            </Container>
          </Grid>
          <Grid
            item
            xs={12}
            style={{
              backgroundColor: styles.colors.oipmBlue,
              padding: 0,
              marginBottom: "98px"
            }}
          >
            <Container style={{ padding: "110px 64px 128px" }}>
              <Typography
                variant="h2"
                style={{
                  color: styles.colors.white,
                  paddingLeft: "6px",
                  paddingBottom: "32px"
                }}
              >
                What are we looking for?
              </Typography>
              <Container
                onClick={scrollIntoViewById("#complaints-over-time")}
                style={{
                  display: "flex",
                  padding: "24px 0px",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
                }}
              >
                <Icon
                  style={{
                    transform: "rotate(90deg)",
                    color: styles.colors.white,
                    opacity: "0.5"
                  }}
                >
                  double_arrow
                </Icon>
                <Typography
                  variant="body1"
                  style={{
                    cursor: "pointer",
                    letterSpacing: "1px",
                    color: styles.colors.white,
                    paddingLeft: "12px",
                    opacity: 0.9
                  }}
                  id="complaints-over-time-link"
                >
                  Who is submitting complaints over time?
                </Typography>
              </Container>
              <Container
                onClick={scrollIntoViewById("#complainants-submit-complaints")}
                style={{
                  display: "flex",
                  padding: "24px 0px",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
                }}
              >
                <Icon
                  style={{
                    transform: "rotate(90deg)",
                    color: styles.colors.white,
                    opacity: "0.5"
                  }}
                >
                  double_arrow
                </Icon>
                <Typography
                  variant="body1"
                  style={{
                    cursor: "pointer",
                    letterSpacing: "1px",
                    color: styles.colors.white,
                    paddingLeft: "12px",
                    opacity: 0.9
                  }}
                >
                  How do complainants submit complaints?
                </Typography>
              </Container>
              <Container
                onClick={scrollIntoViewById("#who-submits-complaints")}
                style={{
                  display: "flex",
                  padding: "24px 0px",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.2)"
                }}
              >
                <Icon
                  style={{
                    transform: "rotate(90deg)",
                    color: styles.colors.white,
                    opacity: "0.5"
                  }}
                >
                  double_arrow
                </Icon>
                <Typography
                  variant="body1"
                  style={{
                    cursor: "pointer",
                    letterSpacing: "1px",
                    color: styles.colors.white,
                    paddingLeft: "12px",
                    opacity: 0.9
                  }}
                >
                  Who submits complaints?
                </Typography>
              </Container>
              <Container
                onClick={scrollIntoViewById("#emerging-themes")}
                style={{
                  display: "flex",
                  padding: "24px 0px",
                  alignItems: "center"
                }}
              >
                <Icon
                  style={{
                    transform: "rotate(90deg)",
                    color: styles.colors.white,
                    opacity: "0.5"
                  }}
                >
                  double_arrow
                </Icon>
                <Typography
                  variant="body1"
                  style={{
                    cursor: "pointer",
                    letterSpacing: "1px",
                    color: styles.colors.white,
                    paddingLeft: "12px",
                    opacity: 0.9
                  }}
                >
                  What themes are emerging from the data?
                </Typography>
              </Container>
            </Container>
          </Grid>
          <Grid item xs={8}>
            <Typography id="complaints-over-time" variant="h2">
              Who is submitting complaints over time?
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="subtitle1">
              Complainant Type over Past 12 Months
            </Typography>
          </Grid>
        <Grid item xs={12} style={{padding: 0}}>
            <img src="https://placekitten.com/g/886/313" />
          </Grid>
          <Grid item xs={8} style={{ paddingBottom: "117px" }}>
            <TextTruncate
              collapsedText={
                "With this chart, the OIPM seeks to capture if there are any patterns around complainants and complaint types during the year. This table tracks the type of complainant who filed a complaint referral with the OIPM over the course of the last twelve months"
              }
              message={
                "With this chart, the OIPM seeks to capture if there are any patterns around complainants and complaint types during the year. This table tracks the type of complainant who filed a complaint referral with the OIPM over the course of the last twelve months.\n\nAs the year progresses, the table will show the last twelve (12) months from the current month (this is a rolling twelve months table).  With this chart, the OIPM seeks to capture if there are any patterns around complainants and complaint types during the year.  For example, there was a peak of complaints from the community – Civilian Complaints – in June during the interactions that occurred around the protests of police misconduct and the protest on the Crescent City Connection bridge.  OIPM tracks to see if there are other concentrations of complainants or complaint types during other points of the year including festival season, Mardi Gras, Essence, Voodoo Festival, hurricane season, sporting events, and the holidays."
              }
            />
          </Grid>
          <Grid item xs={8}>
            <Typography id="complainants-submit-complaints" variant="h2">
              How do complainants submit complaints?
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="subtitle1">
              Complaints by Intake Source
            </Typography>
          </Grid>
        <Grid item xs={12} style={{padding: 0}}>
            <img src="https://placekitten.com/g/886/536" />
          </Grid>
          <Grid item xs={8} style={{ paddingBottom: "117px" }}>
            <TextTruncate
              collapsedText={
                "OIPM works to provide as many methods for communication and intake as possible. This shows the intake source for complaints submitted year-to-date in 2020"
              }
              message={
                "OIPM works to provide as many methods for communication and intake as possible. This shows the intake source for complaints submitted year-to-date in 2020.\n\nThe Office of the Independent Police Monitor tracks complaints and our internal operations to ensure that the OIPM is providing as many opportunities as possible for the public to report alleged misconduct and to help hold officers accountable.  Tracking complaints by intake source is one example of how the OIPM tracks the complaints received.  Intake source refers to the method of communication through which the complaint was communicated to the OIPM.  Currently, complaints can be filed with the OIPM through:\n- Website\n- Email\n- Phone\n- In-person\n- Outreach events\n- Mail\n- Social media\n\nThe following table shows what method the OIPM received the complaints submitted year-to-date in 2020."
              }
            />
          </Grid>
          <Grid item xs={8}>
            <Typography id="who-submits-complaints" variant="h2">Who submits complaints?</Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="subtitle1">
              Complaints by Complainant Type
            </Typography>
          </Grid>
        <Grid item xs={12} style={{padding: 0}}>
            <img src="https://placekitten.com/g/886/536" />
          </Grid>
          <Grid item xs={8} style={{ paddingBottom: "117px" }}>
            <TextTruncate
              collapsedText={
                "The OIPM tracked the complainant type to determine if we are reaching the full population with our services"
              }
              message={
                "The OIPM tracked the complainant type to determine if we are reaching the full population with our services. The different complainant types include:\n\n* Anonymous Complainant (AC) – this means that the individual who filed the complaint either did not disclose his / her name or the complainant did disclose his / her name to OIPM but has asked for his / her name to be removed in the complaint referral to PIB.  In both situations, OIPM counts this complainant as “anonymous.”  This category does not differentiate between individuals who are members of the public or individuals that are employed by the NOPD.\n\n* Civilian Complainant (CC) – this category applies to any member of the public who files a complaint.  This individual may reside in New Orleans or may not.  In these referrals, the individual’s name does appear on the complaint referral to PIB.\n\n* Police Officer Complainant (PO) – Police Officer complainants applies to any sworn officer who files a complaint of misconduct to our office.  In these referrals, OIPM is concerned about the possibility of retaliation that may occur within the police department.  In these referrals, the officer’s name does appear on the complaint referral to PIB.\n\n* Civilian within NOPD Complainant (CN) – this category applies to any civilian who is employed by the NOPD.  In these complaint referrals, OIPM is concerned about the possibility of retaliation that may occur to a civilian by officers within the police department. In these referrals, the employee’s name does appear on the complaint referral to PIB."
              }
            />
          </Grid>
          <Grid item xs={8}>
            <Typography id="emerging-themes" variant="h2">
              What themes are emerging from the data?
      </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="subtitle1">
              Tags and Complaint Subject Matter Themes
      </Typography>
          </Grid>
        <Grid item xs={12} style={{padding: 0}}>
            <img src="https://placekitten.com/g/886/536" />
          </Grid>
          <Grid item xs={8} style={{ paddingBottom: "117px" }}>
            <TextTruncate
              collapsedText={
                "The Office of the Independent Police Monitor labels and categorizes groups of complaints based on subject matter or theme through tags. Note: Not every OIPM case has a tag or associated theme. Visit the Tag Glossary for more information"
              }
              message={
                "The Office of the Independent Police Monitor labels and categorizes groups of complaints based on subject matter or theme through tags. Note: Not every OIPM case has a tag or associated theme. Visit the Tag Glossary for more information.\n\nTags is a term created within the Office of the Independent Police Monitor and it references a way of labeling and categorizing a group of complaints based on subject matter or a theme.  Some tags were created in response to patterns or situations that naturally arise, such as Covid19, Checkpoints or Protests.  Those three tags were created in the spring and summer to track complaints that came during the police’s response to the pandemic or during the public protests of police shootings.  Other tags capture complaints around basic policing tactics or strategies, such Arrest Warrant which is utilized when there are complaints around how arrest warrants were executed, or Failure to Investigate which is utilized when there are complaints concerning investigatory shortcomings.  Finally, some tags were created in response to partnerships with other community organizations to track a shared concerned, such as complaints of misconduct that may result from landlord and tenant issues or misconduct resulting from homelessness and housing insecurity.  In those situations, the OIPM wants to ensure those complainants are also connected with advocacy groups that can assist with services.  As future patterns, concerns, or service opportunities arise, the OIPM will continue to develop and implement new tags.  Visit the tag glossary for an explanation of each label. This chart captures tag use on a rolling twelve month basis. "
              }
            />
      </Grid>
        <Grid
      item
            xs={12}
            style={{
              backgroundColor: styles.colors.softBlack,
              padding: 0,
              marginBottom: "98px"
            }}
          >
            <Container style={{ padding: "110px 64px 128px" }}>
              <Typography
                variant="h2"
                style={{
                  color: styles.colors.white,
                  paddingLeft: "6px",
                  paddingBottom: "36px",
                  maxWidth: "65%"
                }}
        >
        Have you had an encounter with police?
      </Typography>
              <Button
      variant="contained"
      href="https://nolaipm.gov/file-a-complaint/"
                style={{
                  textTransform: "none",
                  padding: "16px 24px",
                  borderRadius: 0,
                  boxShadow: "none",
                  backgroundColor: styles.colors.buttonGray,
                  marginBottom: "4px"
                }}
              >
        <Typography variant="body2">
        File a complaint or commendation
      </Typography>
        </Button>
        </Container>
        </Grid>
      </Grid>
      <Typography
      style={{
        padding: "24px 56px 56px 56px"
      }}
      >
      Last updated 10/22/2020
      </Typography>
      </MuiThemeProvider>
    );
  }
}

export default PublicDataDashboard;
