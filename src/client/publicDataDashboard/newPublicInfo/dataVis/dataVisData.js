export const categories = {
  demographic: "Demographics",
  facilityCapacity: "Facility Capacity"
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
  HCCC: { currentPopulation: 272, capacity: 126 },
  MCCC: { currentPopulation: 278, capacity: 296 },
  OCCC: { currentPopulation: 994, capacity: 778 },
  KCCC: { currentPopulation: 137, capacity: 128 },
  WCCC: { currentPopulation: 182, capacity: 240 },
  WCF: { currentPopulation: 165, capacity: 334 },
  KCF: { currentPopulation: 95, capacity: 160 },
  HCF: { currentPopulation: 879, capacity: 1124 }
};

export const getCapacityPercentages = () => {
  const result = [];
  const facilityNames = Object.keys(facilityGraphData);
  facilityNames.map(facility => {
    const percentage =
      (facilityGraphData[facility].currentPopulation /
        facilityGraphData[facility].capacity) *
      100;
    result.push(percentage);
  });
  return result;
};
