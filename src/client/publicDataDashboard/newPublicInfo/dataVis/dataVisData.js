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
    source: rosterSource,
    sourceNote:
      "The furlough program allows individuals in custody to temporarily leave the facility during the day as they prepare to rejoin the community upon completing their felony sentences. It offers a low-security environment separate from the jail population, but it is underutilized as indicated by low occupancy rates."
  },
  "Incarceration Status - Overall": {
    title: "Incarceration Status - Overall",
    description:
      "System-wide, the largest percentage of people in Hawaii Department of Public Safety Custody are sentenced followed by those awaiting trial.",
    mobileImage: `${config.frontendUrl}/images/graphs/Incarceration_status_overall_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Incarceration_status_overall_desktop.svg`,
    source: rosterSource,
    sourceNote: probationNote
  },
  "Incarceration Status - Jails": {
    title: "Incarceration Status - Jails",
    description:
      "Over half of people incarcerated in the Hawaii jails are awaiting trial, while less than 20% are sentenced, and over 10% are in custody at one of the jails on probation violations.",
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
    description:
      "Hawaii has four jails—Hawaii Community Correctional Center (HCCC), Maui Community Correctional Center (MCCC), Oahu Community Correctional Center (OCCC), and Kauai Community Correctional Center (KCCC)—four prisons run by the Hawaii Department of Public Safety (DPS)—Women’s Community Correctional Center (WCCC), Halawa Correctional Facility (HCF), Waiawa Correctional Facility (WCF), and Kulani Correctional Facility (KCF)—and one private prison run by CoreCivic in Eloy, Arizona—Saguaro Correctional Center (AZSC). The total DPS population count averages 4,100 people.",
    mobileImage: `${config.frontendUrl}/images/graphs/Population_at_each_facility_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Population_at_each_facility_desktop.svg`,
    source: rosterSource
  },
  "Demographics - Age - Overall": {
    title: "Demographics - Age - Overall",
    description:
      "More than half of the people in custody system-wide are between the ages of 25 and 44.",
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
    description:
      "The large majority of people incarcerated at jails in Hawaii are men.  Jails in Hawaii were designed to house men.  There is currently no designated space designed for women, who account for about 10% of the incarcerated jail population.  There is a plan to transfer women at Oahu Community Correctional Center (OCCC) to a new building at the Women’s Community Correctional Center (WCCC), which will provide a designated space for women, but no plan in place for the women housed at the other jails.",
    mobileImage: `${config.frontendUrl}/images/graphs/Demographics_gender_jail_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Demographics_gender_jail_desktop.svg`,
    source: rosterSource
  },
  "Demographics - Gender - Prisons": {
    title: "Demographics - Gender - Prisons",
    description:
      "There are three male prisons run by the Hawaii Department of Public Safety (DPS)—Halawa Correctional Facility (HCF) and Waiawa Correctional Facility (WCF) located on Oahu and Kulani Correctional Facility (KCF) located on Hawaii Island—and one private prison run by CoreCivic in Eloy, Arizona—Saguaro Correctional Center (AZSC). There is one female prison operated by Hawaii DPS and located on Oahu.",
    mobileImage: `${config.frontendUrl}/images/graphs/Demographics_gender_prison_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Demographics_gender_prison_desktop.svg`,
    source: rosterSource
  },
  "Custody Classification": {
    title: "Custody Classification",
    description:
      "There are five classification levels, maximum, close, medium, minimum, and community, listed from most to least restrictive. About half of the people in PSD custody are at a medium custody level.",
    mobileImage: `${config.frontendUrl}/images/graphs/Custody_classification_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Custody_classification_desktop.svg`,
    source: rosterSource
  },
  "Housing Type Overall": {
    title: "Housing Type Overall",
    description:
      "Housing types in Hawaii prisons and jails range from cells, the most restrictive environment, to dorms and work furlough, the least restrictive environment.  Work furlough is a transitional program that allows people in DPS custody to leave the facility to work and seek employment and then return to the facility during non-working hours.",
    mobileImage: `${config.frontendUrl}/images/graphs/Housing_type_overall_mobile.svg`,
    notMobileImage: `${config.frontendUrl}/images/graphs/Housing_type_overall_desktop.svg`,
    source: rosterSource
  },
  "System-wide Housing Type by Facility": {
    title: "System-wide Housing Type by Facility",
    description:
      "In Hawaii jails generally, cells–most restrictive housing–are over capacity and highly utilized, while Furlough–least restive housing and a work release program for those transitioning back to the community–is under capacity and under-utilized.",
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
