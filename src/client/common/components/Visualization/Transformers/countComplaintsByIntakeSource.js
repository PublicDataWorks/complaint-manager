export function transformData(rawData) {
  let labels, values;

  labels = rawData.map(element => {
    return element.name;
  });

  values = rawData.map(element => {
    return parseInt(element.cases);
  });

  const layout = {
    width: 500,
        height: 500,
        title: "Complaints by Intake Source",
        margin: 20
  }

  return {data: {
    type: "pie",
    labels: labels,
    values: values,

  }, layout};
}
