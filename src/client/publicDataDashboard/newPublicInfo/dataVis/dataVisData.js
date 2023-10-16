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
  "Demographics - Ethnicity - Overall",
  "Demographics - Ethnicity - Jails",
  "Demographics - Ethnicity - Prisons",
  "Demographics - Gender - Overall",
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

export const graphInfo = {
  Demographics: {
    title: "Demographic Breakdown",
    description:
      "Native Hawaiian and Pacific Islanders are over incarcerated. This group makes up 23% of the population but makes up 47% of people in custody. Black communities are also disproportionally impacted by incarceration at 3% of the population this group is 5% of those incarcerated.",
    source: bureauSource
  },
  "Facility Overcrowding Rates": {
    title: "Facility Overcrowding Rates",
    description:
      "Hawaii’s jails are chronically and dangerously overcrowded. Even though the prisons in Hawaii are not filled to capacity, Hawaii prisons do not have sufficient capacity for the current incarcerated population. Therefore, around 900 people in Hawaii Department of Public Safety custody are serving their sentences at Saguaro, a private prison run by CoreCivic in Eloy, Arizona.",
    source: rosterSource
  },
  "Incarceration Status - Overall": {
    title: "Incarceration Status - Overall",
    description:
      "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
    mobileImage: `${config.frontendUrl}/images/graphs/Incarceration_status_overall_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Incarceration_status_overall_desktop.svg`,
    source: rosterSource,
    sourceNote: probationNote
  },
  "Incarceration Status - Jails": {
    title: "Incarceration Status - Jails",
    description:
      "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
    mobileImage: `${config.frontendUrl}/images/graphs/Incarceration_status_jail_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Incarceration_status_jail_desktop.svg`,
    source: rosterSource,
    sourceNote: probationNote
  },
  "Incarceration Status - Prisons": {
    title: "Incarceration Status - Prisons",
    description:
      "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
    mobileImage: `${config.frontendUrl}/images/graphs/Incarceration_status_prison_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Incarceration_status_prison_desktop.svg`,
    source: rosterSource,
    sourceNote: probationNote
  },
  "Population at Each Facility": {
    title: "Population at Each Facility",
    description:
      "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
    mobileImage: `${config.frontendUrl}/images/graphs/Population_at_each_facility_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Population_at_each_facility_desktop.svg`,
    source: rosterSource
  },
  "Demographics - Age - Overall": {
    title: "Demographics - Age - Overall",
    description:
      "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
    mobileImage: `${config.frontendUrl}/images/graphs/Demographics_age_overall_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Demographics_age_overall_desktop.svg`,
    source: rosterSource
  },
  "Demographics - Age - Jails": {
    title: "Demographics - Age - Jails",
    description:
      "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
    mobileImage: `${config.frontendUrl}/images/graphs/Demographics_age_jail_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Demographics_age_jail_desktop.svg`,
    source: rosterSource
  },
  "Demographics - Age - Prisons": {
    title: "Demographics - Age - Prisons",
    description:
      "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
    mobileImage: `${config.frontendUrl}/images/graphs/Demographics_age_prison_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Demographics_age_prison_desktop.svg`,
    source: rosterSource
  },
  "Demographics - Ethnicity - Overall": {
    title: "Demographics - Ethnicity - Overall",
    description:
      "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
    mobileImage: `${config.frontendUrl}/images/graphs/Demographics_ethnicity_overall_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Demographics_ethnicity_overall_desktop.svg`,
    source: rosterSource,
    sourceNote: ethnicityNote
  },
  "Demographics - Ethnicity - Jails": {
    title: "Demographics - Ethnicity - Jails",
    description:
      "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
    mobileImage: `${config.frontendUrl}/images/graphs/Demographics_ethnicity_jail_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Demographics_ethnicity_jail_desktop.svg`,
    source: rosterSource,
    sourceNote: ethnicityNote
  },
  "Demographics - Ethnicity - Prisons": {
    title: "Demographics - Ethnicity - Prisons",
    description:
      "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
    mobileImage: `${config.frontendUrl}/images/graphs/Demographics_ethnicity_prison_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Demographics_ethnicity_prison_desktop.svg`,
    source: rosterSource,
    sourceNote: ethnicityNote
  },
  "Demographics - Gender - Overall": {
    title: "Demographics - Gender - Overall",
    description:
      "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
    mobileImage: `${config.frontendUrl}/images/graphs/Demographics_gender_overall_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Demographics_gender_overall_desktop.svg`,
    source: rosterSource
  },
  "Demographics - Gender - Jails": {
    title: "Demographics - Gender - Jails",
    description:
      "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
    mobileImage: `${config.frontendUrl}/images/graphs/Demographics_gender_jail_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Demographics_gender_jail_desktop.svg`,
    source: rosterSource
  },
  "Demographics - Gender - Prisons": {
    title: "Demographics - Gender - Prisons",
    description:
      "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
    mobileImage: `${config.frontendUrl}/images/graphs/Demographics_gender_prison_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Demographics_gender_prison_desktop.svg`,
    source: rosterSource
  },
  "Custody Classification": {
    title: "Custody Classification",
    description:
      "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
    mobileImage: `${config.frontendUrl}/images/graphs/Custody_classification_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Custody_classification_desktop.svg`,
    source: rosterSource
  },
  "Housing Type Overall": {
    title: "Housing Type Overall",
    description:
      "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
    mobileImage: `${config.frontendUrl}/images/graphs/Housing_type_overall_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Housing_type_overall_desktop.svg`,
    source: rosterSource
  },
  "System-wide Housing Type by Facility": {
    title: "System-wide Housing Type by Facility",
    description:
      "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
    mobileImage: `${config.frontendUrl}/images/graphs/System_wide_housing_type_by_facility_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/System_wide_housing_type_by_facility_desktop.svg`,
    source: rosterSource
  }
};

export const demographicData = [
  { title: "White", statePopulation: 25, incarceratedPopulation: 22 },
  { title: "Black", statePopulation: 2, incarceratedPopulation: 5 },
  { title: "Hawaiian", statePopulation: 10, incarceratedPopulation: 44 },
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
