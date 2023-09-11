
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
    },
    graph: <FacilityCapacitySection screenSizes={null} /> // this is where we are left off - need to figure out how to pass in screenSizes
  },
  "Demographics": {
    title: "Demographic Breakdown",
    mobile: {
      description:
        "Hawaiian and Black communities are disproportionally impacted by incarceration."
    },
    notMobile: {
      description: 
        "Native Hawaiian and Pacific Islanders are over incarcerated. This group makes up 23% of the population but makes up 47% of people in custody. Black communities are also disproportionally impacted by incarceration at 3% of the population this group is 5% of those incarcerated."
    },
    graph: <DemographicGraph />
  }
};

export const demographicData = [
  { title: "White", statePopulation: 25, incarceratedPopulation: 22 },
  { title: "Black", statePopulation: 2, incarceratedPopulation: 5 },
  { title: "Hawaiian", statePopulation: 10, incarceratedPopulation: 44 },
  { title: "Asian", statePopulation: 37, incarceratedPopulation: 17 },
  { title: "Latinx", statePopulation: 11, incarceratedPopulation: 2 }
];
