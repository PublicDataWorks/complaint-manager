const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`)[
    process.env.REACT_APP_ENV
  ];

export const categories = {
  demographic: "Demographics",
  facilityCapacity: "Facility Capacity",
  incarcerationStatusOverall: "Incarceration Status - Overall",
  incarcerationStatusJails: "Incarceration Status - Jails",
  incarcerationStatusPrisons: "Incarceration Status - Prisons",
  populationAtEachFacility: "Population at Each Facility",
  demographicsAgeOverall: "Demographics - Age - Overall",
  demographicsAgeJails: "Demographics - Age - Jails",
  demographicsAgePrisons: "Demographics - Age - Prisons",
  demographicsEthnicityOverall: "Demographics - Ethnicity - Overall",
  demographicsEthnicityJails: "Demographics - Ethnicity - Jails",
  demographicsEthnicityPrisons: "Demographics - Ethnicity - Prisons",
  demographicsGenderOverall: "Demographics - Gender - Overall",
  demographicsGenderJails: "Demographics - Gender - Jails",
  demographicsGenderPrisons: "Demographics - Gender - Prisons",
  custodyClassification: "Custody Classification",
  housingTypeOverall: "Housing Type Overall",
  systemWideHousingTypeByFacility: "System-wide Housing Type by Facility"
};

export const graphInfo = {
  "Facility Capacity": {
    title: "Facility Overcrowding Rates",
    mobile: {
      title: "Facility Overcrowding Rates",
      description: "Hawaii’s jail facilities are chronically overcrowded."
    },
    notMobile: {
      description:
        "Hawaii’s jail facilities are chronically overcrowded. So much so that 900 people in custody are serving their sentences in a private prison in Arizona."
    }
  },
  Demographics: {
    title: "Demographic Breakdown",
    mobile: {
      description:
        "Hawaiian and Black communities are disproportionally impacted by incarceration."
    },
    notMobile: {
      description:
        "Native Hawaiian and Pacific Islanders are over incarcerated. This group makes up 23% of the population but makes up 47% of people in custody. Black communities are also disproportionally impacted by incarceration at 3% of the population this group is 5% of those incarcerated."
    }
  },
  "Incarceration Status - Overall": {
    title: "Incarceration Status - Overall",
    mobile: {
      description: "Incarceration Status - Overall of Hawaii's Jails",
      image: `${config.frontendUrl}/images/graphs/Incarceration_status_overall_mobile.svg`
    },
    notMobile: {
      description:
        "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
      image: `${config.frontendUrl}/images/graphs/Incarceration_status_overall_desktop.svg`
    }
  },
  "Incarceration Status - Jails": {
    title: "Incarceration Status - Jails",
    mobile: {
      description: "Incarceration Status - Jails of Hawaii's Jails",
      image: `${config.frontendUrl}/images/graphs/Incarceration_status_jail_mobile.svg`
    },
    notMobile: {
      description:
        "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
      image: `${config.frontendUrl}/images/graphs/Incarceration_status_jail_desktop.svg`
    }
  },
  "Incarceration Status - Prisons": {
    title: "Incarceration Status - Prisons",
    mobile: {
      description: "Incarceration Status - Prisons of Hawaii's Prisons",
      image: `${config.frontendUrl}/images/graphs/Incarceration_status_prison_mobile.svg`
    },
    notMobile: {
      description:
        "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
      image: `${config.frontendUrl}/images/graphs/Incarceration_status_prison_desktop.svg`
    }
  },
  "Population at Each Facility": {
    title: "Population at Each Facility",
    mobile: {
      description: "Incarceration Status - Overall of Hawaii's Jails",
      image: `${config.frontendUrl}/images/graphs/Population_at_each_facility_mobile.svg`
    },
    notMobile: {
      description:
        "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
      image: `${config.frontendUrl}/images/graphs/Population_at_each_facility_desktop.svg`
    }
  },
  "Demographics - Age - Overall": {
    title: "Demographics - Age - Overall",
    mobile: {
      description: "Demographics - Age - Overall of Hawaii's Jails",
      image: `${config.frontendUrl}/images/graphs/Demographics_age_overall_mobile.svg`
    },
    notMobile: {
      description:
        "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
      image: `${config.frontendUrl}/images/graphs/Demographics_age_overall_desktop.svg`
    }
  },
  "Demographics - Age - Jails": {
    title: "Demographics - Age - Jails",
    mobile: {
      description: "Demographics - Age - Jails of Hawaii's Jails",
      image: `${config.frontendUrl}/images/graphs/Demographics_age_jail_mobile.svg`
    },
    notMobile: {
      description:
        "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
      image: `${config.frontendUrl}/images/graphs/Demographics_age_jail_desktop.svg`
    }
  },
  "Demographics - Age - Prisons": {
    title: "Demographics - Age - Prisons",
    mobile: {
      description: "Demographics - Age - Prisons of Hawaii's Jails",
      image: `${config.frontendUrl}/images/graphs/Demographics_age_prison_mobile.svg`
    },
    notMobile: {
      description:
        "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
      image: `${config.frontendUrl}/images/graphs/Demographics_age_prison_desktop.svg`
    }
  },
  "Demographics - Ethnicity - Overall": {
    title: "Demographics - Ethnicity - Overall",
    mobile: {
      description: "Demographics - Ethnicity - Overall of Hawaii's Jails",
      image: `${config.frontendUrl}/images/graphs/Demographics_ethnicity_overall_mobile.svg`
    },
    notMobile: {
      description:
        "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
      image: `${config.frontendUrl}/images/graphs/Demographics_ethnicity_overall_desktop.svg`
    }
  },
  "Demographics - Ethnicity - Jails": {
    title: "Demographics - Ethnicity - Jails",
    mobile: {
      description: "Demographics - Ethnicity - Jails of Hawaii's Jails",
      image: `${config.frontendUrl}/images/graphs/Demographics_ethnicity_jail_mobile.svg`
    },
    notMobile: {
      description:
        "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
      image: `${config.frontendUrl}/images/graphs/Demographics_ethnicity_jail_desktop.svg`
    }
  },
  "Demographics - Ethnicity - Prisons": {
    title: "Demographics - Ethnicity - Prisons",
    mobile: {
      description: "Demographics - Ethnicity - Prisons of Hawaii's Prisons",
      image: `${config.frontendUrl}/images/graphs/Demographics_ethnicity_prison_mobile.svg`
    },
    notMobile: {
      description:
        "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
      image: `${config.frontendUrl}/images/graphs/Demographics_ethnicity_prison_desktop.svg`
    }
  },
  "Demographics - Gender - Overall": {
    title: "Demographics - Gender - Overall",
    mobile: {
      description: "Demographics - Gender - Overall of Hawaii's Jails",
      image: `${config.frontendUrl}/images/graphs/Demographics_gender_overall_mobile.svg`
    },
    notMobile: {
      description:
        "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
      image: `${config.frontendUrl}/images/graphs/Demographics_gender_overall_desktop.svg`
    }
  },
  "Demographics - Gender - Jails": {
    title: "Demographics - Gender - Jails",
    mobile: {
      description: "Demographics - Gender - Jails of Hawaii's Jails",
      image: `${config.frontendUrl}/images/graphs/Demographics_gender_jail_mobile.svg`
    },
    notMobile: {
      description:
        "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
      image: `${config.frontendUrl}/images/graphs/Demographics_gender_jail_desktop.svg`
    }
  },
  "Demographics - Gender - Prisons": {
    title: "Demographics - Gender - Prisons",
    mobile: {
      description: "Demographics - Gender - Prisons of Hawaii's Jails",
      image: `${config.frontendUrl}/images/graphs/Demographics_gender_prison_mobile.svg`
    },
    notMobile: {
      description:
        "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
      image: `${config.frontendUrl}/images/graphs/Demographics_gender_prison_desktop.svg`
    }
  },
  "Custody Classification": {
    title: "Custody Classification",
    mobile: {
      description: "Custody Classification of Hawaii's Jails",
      image: `${config.frontendUrl}/images/graphs/Custody_classification_mobile.svg`
    },
    notMobile: {
      description:
        "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
      image: `${config.frontendUrl}/images/graphs/Custody_classification_desktop.svg`
    }
  },
  "Housing Type Overall": {
    title: "Housing Type Overall",
    mobile: {
      description: "Housing Type Overall of Hawaii's Jails",
      image: `${config.frontendUrl}/images/graphs/Housing_type_overall_mobile.svg`
    },
    notMobile: {
      description:
        "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
      image: `${config.frontendUrl}/images/graphs/Housing_type_overall_desktop.svg`
    }
  },
  "System-wide Housing Type by Facility": {
    title: "System-wide Housing Type by Facility",
    mobile: {
      description: "System-wide Housing Type by Facility of Hawaii's Jails",
      image: `${config.frontendUrl}/images/graphs/System_wide_housing_type_by_facility_mobile.svg`
    },
    notMobile: {
      description:
        "Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description. Test Description.",
      image: `${config.frontendUrl}/images/graphs/System_wide_housing_type_by_facility_desktop.svg`
    }
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
