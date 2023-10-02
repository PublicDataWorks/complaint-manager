import { render, screen } from "@testing-library/react";
import React from "react";
import PublicDataDashboard from "./PublicDataDashboard";
import { BrowserRouter as Router } from "react-router-dom";
import createConfiguredStore from "../createConfiguredStore";
import { Provider } from "react-redux";
import {
  CONFIGS,
  GET_CONFIGS_SUCCEEDED
} from "../../sharedUtilities/constants";
import nock from "nock";
import "@testing-library/jest-dom";

jest.mock(
  "../common/components/Visualization/Visualization",
  () => () => "Visualization"
);

jest.mock("./DashboardDataSection", () => () => "DashboardDataSection");

describe("Public Data Dashboard", () => {
  let getVisualizations;
  beforeEach(() => {
    nock.cleanAll();
    getVisualizations = nock("http://localhost")
      .get("/api/visualizations")
      .reply(200, [
        {
          id: 1,
          title: "Where are the alleged misconduct incidents occurring?",
          subtitle: "Complaint Density Map of New Orleans",
          queryType: "LOCATION_DATA",
          collapsedText:
            "This data visualization is a “density” map showing where in the city the complaints of officer misconduct are concentrated. The purpose of this map is for the community to learn more about where complaints of misconduct are occurring and how it influences the neighborhood and city around them.",
          fullMessage:
            "This data visualization is a “density” map showing where in the city the complaints of officer misconduct are concentrated. The purpose of this map is for the community to learn more about where complaints of misconduct are occurring and how it influences the neighborhood and city around them. The complaints of officer misconduct are limited to what is filed with the Office of the Independent Police Monitor.  Through this map, the viewer can see where the majority of the complaints of officer misconduct are occurring based on the location of the misconduct incident.  This map gives the viewer the option of zooming in or out to see the city as a whole or focus on one neighborhood.  For context, there is the option for the viewer to overlay the locations of public schools, libraries, or public parks on the map.  This will help the viewer conceptualize the location more dimensionally, since it will be in relation to recognizable community landmarks or gathering points for the neighborhood.  The viewer also has the option to overlay police district boundary lines over the map to see the complaint data in context of police districts and to compare district to district.   \n    There are some limitations to this map.  In some cases, the location may be hard to identify if the alleged misconduct occurred on the internet or over the phone, but the Office of the Independent Police Monitor strove to verify locations by identifying the district of the assigned officer who allegedly committed the misconduct.  This map is also limited to complaints received beginning in 2019.",
          orderKey: 1,
          createdAt: null,
          updatedAt: null
        },
        {
          id: 2,
          title: "Who is submitting complaints over time?",
          subtitle: "Complainant Type Over Time",
          queryType: "COUNT_MONTHLY_COMPLAINTS_BY_COMPLAINANT_TYPE",
          collapsedText:
            "With this chart, the OIPM seeks to capture if there are any patterns around complainants and complaint types during the year. This table tracks the type of complainant who filed a complaint referral with the OIPM within a given time period",
          fullMessage:
            "With this chart, the OIPM seeks to capture if there are any patterns around complainants and complaint types during the year. This table tracks the type of complainant who filed a complaint referral with the OIPM within a given time period.\n\nWith this chart, the OIPM seeks to capture if there are any patterns around complainants and complaint types during the year.  For example, there was a peak of complaints from the community – Civilian Complaints – in June during the interactions that occurred around the protests of police misconduct and the protest on the Crescent City Connection bridge.  OIPM tracks to see if there are other concentrations of complainants or complaint types during other points of the year including festival season, Mardi Gras, Essence, Voodoo Festival, hurricane season, sporting events, and the holidays.",
          orderKey: 2,
          createdAt: null,
          updatedAt: null
        },
        {
          id: 3,
          title: "How do complainants submit complaints?",
          subtitle: "Complaints by Intake Source",
          queryType: "COUNT_COMPLAINTS_BY_INTAKE_SOURCE",
          collapsedText:
            "OIPM works to provide as many methods for communication and intake as possible. This shows the intake source for complaints submitted within a given time period.",
          fullMessage:
            "OIPM works to provide as many methods for communication and intake as possible. This shows the intake source for complaints submitted within a given time period.\n\nThe Office of the Independent Police Monitor tracks complaints and our internal operations to ensure that the OIPM is providing as many opportunities as possible for the public to report alleged misconduct and to help hold officers accountable.  Intake source refers to the method of communication through which the complaint was communicated to the OIPM.  Currently, complaints can be filed with the OIPM through:\n• Website\n• Email\n• Phone\n• In-person\n• Outreach Events\n• Social Media\n• U.S. Mail\n• Video Call",
          orderKey: 3,
          createdAt: null,
          updatedAt: null
        },
        {
          id: 4,
          title: "Who submits complaints?",
          subtitle: "Complaints by Complainant Type",
          queryType: "COUNT_COMPLAINTS_BY_COMPLAINANT_TYPE",
          collapsedText:
            "The OIPM tracked the complainant type to determine if we are reaching the full population with our services.",
          fullMessage:
            "The OIPM tracked the complainant type to determine if we are reaching the full population with our services. The different complainant types include:\n\n• Anonymous Complainant (AC) – this means that the individual who filed the complaint either did not disclose his / her name or the complainant did disclose his / her name to OIPM but has asked for his / her name to be removed in the complaint referral to PIB.  In both situations, OIPM counts this complainant as “anonymous.”  This category does not differentiate between individuals who are members of the public or individuals that are employed by the NOPD.\n\n• Civilian Complainant (CC) – this category applies to any member of the public who files a complaint.  This individual may or may not reside in New Orleans.  In these referrals, the individual’s name does appear on the complaint referral to PIB.\n\n• Police Officer Complainant (PO) – Police Officer complainants applies to any sworn officer who files a complaint of misconduct to our office.  OIPM reviews these referrals to identify and highlight any possibility of retaliation within the police department.  In these referrals, the officer’s name does appear on the complaint referral to PIB.\n\n• Civilian within NOPD Complainant (CN) – this category applies to any civilian who is employed by the NOPD. In these complaint referrals, OIPM is concerned about the possibility of retaliation that may occur to a civilian by officers within the police department. In these referrals, the employee’s name does appear on the complaint referral to PIB.",
          orderKey: 4,
          createdAt: null,
          updatedAt: null
        },
        {
          id: 5,
          title: "What themes are emerging from the data?",
          subtitle: "Tags and Complaint Subject Matter Themes",
          queryType: "COUNT_TOP_10_TAGS",
          collapsedText:
            "The Office of the Independent Police Monitor labels and categorizes groups of complaints based on subject matter or theme through tags. Note: Not every OIPM case has a tag or associated theme. Visit the #Tag Glossary linkTo /data/glossary# for more information",
          fullMessage:
            "The Office of the Independent Police Monitor labels and categorizes groups of complaints based on subject matter or theme through tags. Note: Not every OIPM case has a tag or associated theme. Visit the #Tag Glossary linkTo /data/glossary# for more information.\n\nTags is a term created within the Office of the Independent Police Monitor and it references a way of labeling and categorizing a group of complaints based on subject matter or a theme.  Some tags were created in response to patterns or situations that naturally arise, such as Covid19, Checkpoints or Protests.  Those three tags were created in the spring and summer to track complaints that came during the police’s response to the pandemic or during the public protests of police shootings.  Other tags capture complaints around basic policing tactics or strategies, such Arrest Warrant which is utilized when there are complaints around how arrest warrants were executed, or Failure to Investigate which is utilized when there are complaints concerning investigatory shortcomings.  Finally, some tags were created in response to partnerships with other community organizations to track a shared concern, such as complaints of misconduct that may result from landlord and tenant issues or misconduct resulting from housing insecurity.  In those situations, the OIPM wants to ensure those complainants are also connected with advocacy groups that can assist with services.  As future patterns, concerns, or service opportunities arise, the OIPM will continue to develop and implement new tags.",
          orderKey: 5,
          createdAt: null,
          updatedAt: null
        },
        {
          id: 6,
          title: "Which districts have the most complaints?",
          subtitle: "Complaints by District",
          queryType: "COUNT_COMPLAINTS_BY_DISTRICT",
          collapsedText:
            "This bar chart communicates the number of complaints of officer misconduct the Office of the Independent Police Monitor received by district. This chart helps the public, NOPD, and community organization partners compare and contrast the number of complaints per police district.",
          fullMessage:
            "This bar chart communicates the number of complaints of officer misconduct the Office of the Independent Police Monitor received by district. This chart helps the public, NOPD, and community organization partners compare and contrast the number of complaints per police district.  There are eight (8) police districts in New Orleans.  When a complainant provides an account of officer misconduct to the Office of the Independent Police Monitor, the complainant intake specialist will try to identify the district where the misconduct occurred or where the officer who committed the misconduct is assigned (for allegations that occur over the phone or online).",
          orderKey: 6,
          createdAt: null,
          updatedAt: null
        },
        {
          id: 7,
          title: "What are the most frequently recommended allegations?",
          subtitle: "Most Frequently Recommended Allegations of Misconduct",
          queryType: "COUNT_TOP_10_ALLEGATIONS",
          collapsedText:
            "This bar chart captures the top allegations of officer misconduct.  This chart is limited to the allegations of misconduct filed with the Office of the Independent Police Monitor.",
          fullMessage:
            "This bar chart captures the top allegations of officer misconduct.  This chart is limited to the allegations of misconduct filed with the Office of the Independent Police Monitor.  These allegations are often identified by the Office of the Independent Police Monitor based on the information provided by the complainant about what they believed occurred.  These allegations are recommendations put forth to the Public Integrity Bureau of the NOPD and helps them structure the potential misconduct investigation.  These allegations are the top allegations put forth by the Office of the Independent Police Monitor.",
          orderKey: 7,
          createdAt: null,
          updatedAt: null
        }
      ]);
  });

  test("should render public data dashboard with correct styling", async () => {
    const store = createConfiguredStore();

    render(
      <Provider store={store}>
        <Router>
          <PublicDataDashboard />
        </Router>
      </Provider>
    );

    expect(
      await screen.findByText(
        "Where are the alleged misconduct incidents occurring?"
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Who is submitting complaints over time?")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("How do complainants submit complaints?")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Who submits complaints?")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("What themes are emerging from the data?")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Which districts have the most complaints?")
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        "What are the most frequently recommended allegations?"
      )
    ).toBeInTheDocument();
  });
});
