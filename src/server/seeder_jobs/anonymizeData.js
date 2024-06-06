const models = require("../policeDataManager/models");
const DataAnonymizer = require("data-anonymizer");

const ANONYMIZED_FIELDS = {
  cases: [
    "narrativeDetails",
    "createdBy",
    "assignedTo",
    "narrativeSummary",
    "caseNumber",
    "pibCaseNumber"
  ]
};

const anonymizeTable = async (modelName, data) => {
  const anonymizer = new DataAnonymizer();
  const fields = ANONYMIZED_FIELDS[modelName];
  return data.map(row => {
    const jsonRow = row.toJSON();
    return Object.keys(jsonRow).reduce((acc, key) => {
      console.log(key, jsonRow[key]);
      if (fields.includes(key) && jsonRow[key]) {
        acc[key] = anonymizer.anonymize(jsonRow[key]);
      } else {
        acc[key] = jsonRow[key];
      }
      return acc;
    }, {});
  });
};

async function pullAnonymizedData() {
  const data = {};

  //   for (const modelName in models) {
  const modelName = "cases";
  const model = models[modelName];
  if (model.findAll) {
    const results = await model.findAll();
    data[modelName] = anonymizeTable(modelName, results);
  }
  //   }

  const jsonData = JSON.stringify(data);
  console.log(jsonData); // You can save or use the JSON data as per your requirement
}

pullAnonymizedData();
