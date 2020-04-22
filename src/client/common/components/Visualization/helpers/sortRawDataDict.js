export const sortRawDataDict = (rawData, sortData) => {
  let key, i;
  const keys = [];
  for (key in rawData) {
    keys[keys.length] = key;
  }

  const valueObjects = [];
  for (i = 0; i < keys.length; i++) {
    valueObjects[valueObjects.length] = rawData[keys[i]];
  }

  return valueObjects.sort((valueObjA, valueObjB) =>
    sortData(valueObjA, valueObjB)
  );
};
