const fs = require("fs");
const readline = require("readline");

function readCSV(filePath) {
  const data = fs
    .readFileSync(filePath, "utf8")
    .split("\n")
    .map(row => row.split(","));
  const headers = data[0];
  return data.slice(1).map(row => {
    const rowData = {};
    headers.forEach((header, index) => {
      rowData[header] = row[index];
    });
    return rowData;
  });
}

const casesOfficersAddon = [];

const officersWithCasesData = readCSV(
  "/Users/claireholt/officers_with_cases.csv"
);

const casesOfficersProd = readCSV(
  "/Users/claireholt/cases_officers_table_noipm_copy.csv"
);

officersWithCasesData.forEach(officer => {
  // Lookup cases officers for current officer
  let matchingCasesOfficer = casesOfficersProd.filter(
    casesOfficerProd => casesOfficerProd['"officer_id"'] === officer.id
  );
  // Add matching cases officers to casesOfficersAddon
  matchingCasesOfficer.forEach(matchingCasesOfficer => {
    casesOfficersAddon.push(matchingCasesOfficer);
  });
});

// Write to new CSV files
const casesOfficersAddonStream = fs.createWriteStream(
  "/Users/claireholt/cases_officers_addon_march5.csv"
);
casesOfficersAddon.forEach(row => {
  const rowArray = Object.values(row);
  casesOfficersAddonStream.write(rowArray.join(",") + "\n");
});
casesOfficersAddonStream.end();

console.log("Script completed successfully.");
