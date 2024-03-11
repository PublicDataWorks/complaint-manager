const { match } = require("assert");
const fs = require("fs");

// This script checks for duplicated officers by looking for duplicated windows_usernames and checks all caseOfficer officer_ids point to valid officers

// Function to read CSV file
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

const checkOfficersData = (officersData, casesOfficersData) => {
  for (const caseOfficer of casesOfficersData) {
    // Check if officer_id exists in officersData
    const matchingOfficer = officersData.find(
      officer => officer.id == caseOfficer.officer_id
    );

    // Log error if officer_id does not exist in officersData
    if (!matchingOfficer && caseOfficer.officer_id !== "") {
      console.log(
        `Invalid officer_id ${caseOfficer.officer_id} in new_cases_officers.csv`
      );
      if (!caseOfficer.officer_id) {
        console.log("undefined case officer", caseOfficer);
      }
    } else if (matchingOfficer) {
      // Log error if officer_id exists but name does not match
      if (
        matchingOfficer.first_name !== caseOfficer.first_name ||
        matchingOfficer.last_name !== caseOfficer.last_name
      ) {
        console.log(
          `Name mismatch for officer_id ${caseOfficer.officer_id} in new_cases_officers.csv`
        );
        console.log(
          "matchingOfficer.first_name and last_name: ",
          matchingOfficer.first_name,
          matchingOfficer.last_name
        );
        console.log(
          "caseOfficer.first_name and last_name: ",
          caseOfficer.first_name,
          caseOfficer.last_name
        );
      }
    }
  }
};

// Function to check for duplicated officers
const checkDuplicatedOfficers = officersData => {
  const seenUsernames = new Set();
  const seenNames = new Set();
  for (const officer of officersData) {
    // Log error if windows_username is duplicated
    if (seenUsernames.has(officer.windows_username)) {
      console.log(
        `Duplicate windows_username: ${officer.windows_username} in new_officers_merged.csv`
      );
    } else {
      seenUsernames.add(officer.windows_username);
    }
  }
};

const officersData = readCSV("/Users/claireholt/new_officers_merged.csv");
const casesOfficersData = readCSV("/Users/claireholt/new_cases_officers.csv");

checkOfficersData(officersData, casesOfficersData);
checkDuplicatedOfficers(officersData);
