export function transformData(rawData) {
  let labels, values;

  labels = rawData.map(element => {
    return element.name;
  });

  values = rawData.map(element => {
    return parseInt(element.cases);
  });

  return { type: "pie", labels: labels, values: values };
}
