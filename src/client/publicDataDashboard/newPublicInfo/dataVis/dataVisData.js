import React from "react";

const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

export const categories = [
  "Demographics",
  "Facility Overcrowding Rates",
  "Incarceration Status - Overall",
  "Incarceration Status - Jails",
  "Incarceration Status - Prisons",
  "Population at Each Facility",
  "Demographics - Age - Overall",
  "Demographics - Age - Jails",
  "Demographics - Age - Prisons",
  // "Demographics - Ethnicity - Overall",
  // "Demographics - Ethnicity - Jails",
  // "Demographics - Ethnicity - Prisons",
  // "Demographics - Gender - Overall",
  "Demographics - Gender - Jails",
  "Demographics - Gender - Prisons",
  "Custody Classification",
  "Housing Type Overall",
  "System-wide Housing Type by Facility"
];

const probationNote =
  "Probation: A large majority of people in this designation are incarcerated on probation violations.";
const ethnicityNote = "Demographics are self-reported by people in custody.";
const rosterSource =
  "Hawaii Department of Public Safety, Roster, Sept. 11, 2023";
const bureauSource =
  "Bureau of Justice Statistics, Federal Justice Statistics Program, 2021 (preliminary); US Census, 2022; and National Prisoner Statistics, 2021";
const formattedDemographicsBreakdownDescription = (
  <>
    Native Hawaiian and Pacific Islanders are over-represented in our jails and
    prisons. Native Hawaiian and Pacific Islanders makes up{" "}
    <strong>23% of the population</strong> but makes up{" "}
    <strong>47% of people in custody</strong>. Black communities are also
    disproportionally impacted by incarceration at 3% of the population this
    group is 5% of those incarcerated.
  </>
);
const formattedOvercrowdingDescription = (
  <>
    Hawaii’s jails are <strong>chronically</strong> and{" "}
    <strong>dangerously overcrowded</strong>. Even though the prisons in Hawaii
    are not filled to capacity,{" "}
    <strong>
      Hawaii prisons do not have sufficient capacity for the current
      incarcerated population
    </strong>
    . Around 900 people in Hawaii Department of Public Safety custody are
    serving their sentences at Saguaro, a private prison run by CoreCivic in
    Eloy, Arizona -{" "}
    <strong>
      over 3,000 miles away from their friends, family, and community
    </strong>
    .
  </>
);
const formattedIncarceratedJailDescription = (
  <>
    <strong>Over half</strong> of people incarcerated in the Hawaii jails are
    awaiting trial, while less than 20% are sentenced, and over 10% are in
    custody at one of the jails on probation violations.
  </>
);
const formattedPopulationAtEachFacilityDescription = (
  <>
    The total PSD population count averages 4,100 people and who are scattered
    throughout:
    <br />
    <br />
    <strong>Four State Jails</strong>—Hawaii Community Correctional Center
    (HCCC), Maui Community Correctional Center (MCCC), Oahu Community
    Correctional Center (OCCC), and Kauai Community Correctional Center (KCCC).{" "}
    <br />
    <br />
    <strong>Four State Prisons</strong>—Women’s Community Correctional Center
    (WCCC), Halawa Correctional Facility (HCF), Waiawa Correctional Facility
    (WCF), and Kulani Correctional Facility (KCF)
    <br />
    <br />
    <strong>One Private Prison</strong>—Saguaro Correctional Center (AZSC) run
    by CoreCivic in Eloy, Arizona.
    <br />
    <br />
    <strong>
      OCCC, Hawaii’s largest jail, accounts for the most amount of incarcerated
      people throughout the state at 26.3%.
    </strong>
  </>
);
const formattedDemographicsAgeOverallDescription = (
  <>
    <strong>More than half</strong> of the people in custody system-wide are
    between the ages of 25 and 44.
  </>
);
const formattedDemographicsGenderJailsDescription = (
  <>
    <strong>Hawaii does not have any female-specific jails</strong> even though
    women account for about 10% of the incarcerated jail population. This means
    that <strong>women are housed in men’s facilities</strong>.
    <br />
    <br />
    There is a plan to transfer women who are currently housed at the OCCC
    (men’s jail) to a new building at the WCCC (women’s prison). But there is{" "}
    <strong>
      no plan in place for the women housed in men’s jails on the neighbor
      islands.
    </strong>
  </>
);
const formattedDemographicsGenderPrisonsDescription = (
  <>
    The large majority of people incarcerated in Hawaii are men. Although
    nationally the rate of incarceration for women has been increasing
    drastically over the past few decades - the female incarcerated population
    stands over{" "}
    <strong>
      <a
        href="https://www.sentencingproject.org/fact-sheet/incarcerated-women-and-girls/"
        target="_blank"
      >
        six times higher
      </a>
    </strong>{" "}
    than in 1980.
    <br />
    <br />
    All longer term sentenced women are housed in WCCC (a women’s prison). All
    longer term sentenced men are housed throughout HCF, KCF, WCF, and AZSC (all
    men’s prisons).
  </>
);
const formattedCustodyClassificationDescription = (
  <>
    There are five classification levels. From most to least restrictive:
    Maximum, Close, Medium, Minimum, and Community.
    <br />
    <br />
    In accordance to PSD policy, Maximum, Close, and Medium custody individuals
    must be placed in <strong>more secured housing</strong>. This means that{" "}
    <strong>65% of people are to be housed in secure/restrictive cells</strong>{" "}
    and not dormitory settings (70% in prisons, 59% in jails).
  </>
);
const formattedHousingTypeOverallDescription = (
  <>
    Housing types in Hawaii prisons and jails range from cells, the most
    restrictive environment, to dorms and work furlough, the least restrictive
    environment. Work furlough is a transitional program that allows people in
    PSD custody to leave the facility to work and seek employment and then
    return to the facility during non-working hours. Furlough housing exists at
    WCCC, HCCC, OCCC, KCCC, and MCCC.
    <br />
    <br />
    <strong>Cells</strong> (most restrictive housing){" "}
    <strong>are over capacity and highly utilized</strong>, while{" "}
    <strong>Furlough and dorms</strong> (least restive housing){" "}
    <strong>is under capacity and under-utilized</strong>.
  </>
);
const formattedHousingTypeByFacilityDescription = (
  <>
    Housing types in Hawaii prisons and jails range from cells, the most
    restrictive environment, to dorms and work furlough, the least restrictive
    environment. Work furlough is a transitional program that allows people in
    custody to leave the facility to work and seek employment and then return to
    the facility during non-working hours. Furlough housing exists at WCCC,
    HCCC, OCCC, KCCC, and MCCC.
    <br />
    <br />
    <strong>Cells</strong> (most restrictive housing){" "}
    <strong>are over capacity and highly utilized</strong>, while{" "}
    <strong>Furlough and dorms</strong> (least restive housing){" "}
    <strong>is under capacity and under-utilized</strong>.
  </>
);

export const graphInfo = {
  Demographics: {
    title: "Demographic Breakdown",
    description: formattedDemographicsBreakdownDescription,
    source: bureauSource,
    sourceNote:
      "Federal sources do not separate Hawaiian and Pacific Islander population."
  },
  "Facility Overcrowding Rates": {
    title: "Facility Overcrowding Rates",
    description: formattedOvercrowdingDescription,
    source: rosterSource,
    sourceNote:
      "The furlough program allows individuals in custody to temporarily leave the facility to work at their assigned job sites during the day as they prepare to rejoin the community upon completing their felony sentences. It offers a low-security environment separate from the jail population, but it is underutilized as indicated by low occupancy rates."
  },
  "Incarceration Status - Overall": {
    title: "Incarceration Status - Overall",
    description: "",
    mobileImage: `${config.frontendUrl}/images/graphs/Incarceration_status_overall_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Incarceration_status_overall_desktop.svg`,
    source: rosterSource,
    sourceNote: probationNote
  },
  "Incarceration Status - Jails": {
    title: "Incarceration Status - Jails",
    description: formattedIncarceratedJailDescription,
    mobileImage: `${config.frontendUrl}/images/graphs/Incarceration_status_jail_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Incarceration_status_jail_desktop.svg`,
    source: rosterSource,
    sourceNote: probationNote
  },
  "Incarceration Status - Prisons": {
    title: "Incarceration Status - Prisons",
    description: "Over 95% of people in prison are sentenced.",
    mobileImage: `${config.frontendUrl}/images/graphs/Incarceration_status_prison_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Incarceration_status_prison_desktop.svg`,
    source: rosterSource,
    sourceNote: probationNote
  },
  "Population at Each Facility": {
    title: "Population at Each Facility",
    description: formattedPopulationAtEachFacilityDescription,
    mobileImage: `${config.frontendUrl}/images/graphs/Population_at_each_facility_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Population_at_each_facility_desktop.svg`,
    source: rosterSource
  },
  "Demographics - Age - Overall": {
    title: "Demographics - Age - Overall",
    description: formattedDemographicsAgeOverallDescription,
    mobileImage: `${config.frontendUrl}/images/graphs/Demographics_age_overall_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Demographics_age_overall_desktop.svg`,
    source: rosterSource
  },
  "Demographics - Age - Jails": {
    title: "Demographics - Age - Jails",
    description:
      "The large majority of the people in Hawaii jails are between the ages of 25 and 44.",
    mobileImage: `${config.frontendUrl}/images/graphs/Demographics_age_jail_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Demographics_age_jail_desktop.svg`,
    source: rosterSource
  },
  "Demographics - Age - Prisons": {
    title: "Demographics - Age - Prisons",
    description:
      "Most of the people in Hawaii prisons are between the ages of 25 and 44.",
    mobileImage: `${config.frontendUrl}/images/graphs/Demographics_age_prison_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Demographics_age_prison_desktop.svg`,
    source: rosterSource
  },
  "Demographics - Ethnicity - Overall": {
    title: "Demographics - Ethnicity - Overall",
    description:
      "Native Hawaiians are overrepresented in the justice system compared to the general population and represent the largest group, demographically, incarcerated in Hawaii’s prisons and jails.",
    mobileImage: `${config.frontendUrl}/images/graphs/Demographics_ethnicity_overall_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Demographics_ethnicity_overall_desktop.svg`,
    source: rosterSource,
    sourceNote: ethnicityNote
  },
  "Demographics - Ethnicity - Jails": {
    title: "Demographics - Ethnicity - Jails",
    description:
      "Native Hawaiians represent the largest population of people incarcerated in Hawaii’s jails followed by Asian and Pacific Islanders.",
    mobileImage: `${config.frontendUrl}/images/graphs/Demographics_ethnicity_jail_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Demographics_ethnicity_jail_desktop.svg`,
    source: rosterSource,
    sourceNote: ethnicityNote
  },
  "Demographics - Ethnicity - Prisons": {
    title: "Demographics - Ethnicity - Prisons",
    description:
      "Native Hawaiians represent the largest population of people incarcerated in Hawaii’s prisons followed by Asian and Pacific Islanders.",
    mobileImage: `${config.frontendUrl}/images/graphs/Demographics_ethnicity_prison_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Demographics_ethnicity_prison_desktop.svg`,
    source: rosterSource,
    sourceNote: ethnicityNote
  },
  "Demographics - Gender - Overall": {
    title: "Demographics - Gender - Overall",
    description:
      "The large majority of people incarcerated in Hawaii are men. Although nationally the rate of incarceration for women has been increasing drastically over the past few decades.",
    mobileImage: `${config.frontendUrl}/images/graphs/Demographics_gender_overall_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Demographics_gender_overall_desktop.svg`,
    source: rosterSource
  },
  "Demographics - Gender - Jails": {
    title: "Demographics - Gender - Jails",
    description: formattedDemographicsGenderJailsDescription,
    mobileImage: `${config.frontendUrl}/images/graphs/Demographics_gender_jail_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Demographics_gender_jail_desktop.svg`,
    source: rosterSource
  },
  "Demographics - Gender - Prisons": {
    title: "Demographics - Gender - Prisons",
    description: formattedDemographicsGenderPrisonsDescription,
    mobileImage: `${config.frontendUrl}/images/graphs/Demographics_gender_prison_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Demographics_gender_prison_desktop.svg`,
    source: rosterSource
  },
  "Custody Classification": {
    title: "Custody Classification",
    description: formattedCustodyClassificationDescription,
    mobileImage: `${config.frontendUrl}/images/graphs/Custody_classification_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Custody_classification_desktop.svg`,
    source: rosterSource
  },
  "Housing Type Overall": {
    title: "Housing Type Overall",
    description: formattedHousingTypeOverallDescription,
    mobileImage: `${config.frontendUrl}/images/graphs/Housing_type_overall_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Housing_type_overall_desktop.svg`,
    source: rosterSource
  },
  "System-wide Housing Type by Facility": {
    title: "System-wide Housing Type by Facility",
    description: formattedHousingTypeByFacilityDescription,
    mobileImage: `${config.frontendUrl}/images/graphs/System_wide_housing_type_by_facility_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/System_wide_housing_type_by_facility_desktop.svg`,
    source: rosterSource
  }
};

export const demographicData = [
  { title: "White", statePopulation: 25, incarceratedPopulation: 22 },
  { title: "Black", statePopulation: 2, incarceratedPopulation: 5 },
  { title: "Hawaiian/PI*", statePopulation: 10, incarceratedPopulation: 44 },
  { title: "Asian", statePopulation: 37, incarceratedPopulation: 17 },
  { title: "Latinx", statePopulation: 11, incarceratedPopulation: 2 }
];

export const facilityGraphData = {
  HCCC: {
    facilityName: "Hawaii Community Correctional Center",
    mainOccupancy: 292,
    mainCapacity: 126,
    furloughOccupancy: 28,
    furloughCapacity: 100
  },
  MCCC: {
    facilityName: "Maui Community Correctional Center",
    mainOccupancy: 292,
    mainCapacity: 269,
    furloughOccupancy: 6,
    furloughCapacity: 32
  },
  OCCC: {
    facilityName: "Oahu Community Correctional Center",
    mainOccupancy: 952,
    mainCapacity: 778,
    furloughOccupancy: 102,
    furloughCapacity: 176
  },
  KCCC: {
    facilityName: "Kauai Community Correctional Center",
    mainOccupancy: 125,
    mainCapacity: 128
  },
  WCCC: {
    facilityName: "Women's Community Correctional Center",
    mainOccupancy: 212,
    mainCapacity: 240,
    furloughOccupancy: 11,
    furloughCapacity: 20
  },
  WCF: {
    facilityName: "Walawa Correctional Facility",
    mainOccupancy: 161,
    mainCapacity: 334
  },
  KCF: {
    facilityName: "Kulani Correctional Facility",
    mainOccupancy: 84,
    mainCapacity: 160
  },
  HCF: {
    facilityName: "Halawa Correctional Facility",
    mainOccupancy: 877,
    mainCapacity: 1124
  }
};

export const getCapacityPercentages = () => {
  const mainResult = [];
  const furloughResult = [];
  const facilityNames = Object.keys(facilityGraphData);

  facilityNames.map(facility => {
    const currentFacility = facilityGraphData[facility];
    const mainCapacityPercentage =
      (currentFacility.mainOccupancy / currentFacility.mainCapacity) * 100;
    const furloughCapacityPercentage = currentFacility.furloughCapacity
      ? (currentFacility.furloughOccupancy / currentFacility.furloughCapacity) *
        100
      : 0;

    mainResult.push(mainCapacityPercentage);
    furloughResult.push(furloughCapacityPercentage);
  });
  return [mainResult, furloughResult];
};
