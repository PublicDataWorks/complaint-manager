export const sortRawDataDict = (rawData, sortData) => {
  const keys = [];
  for (let key in rawData) {
    keys.push(key);
  }

  const valueObjects = [];
  for (let index = 0; index < keys.length; index++) {
    valueObjects.push(rawData[keys[index]]);
  }

  return valueObjects.sort((valueObjA, valueObjB) =>
    sortData(valueObjA, valueObjB)
  );
};
