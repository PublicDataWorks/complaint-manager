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

const newOfficersMerged = [];
const newToOfficersMerge = [];
const casesOfficersAddon = [];

const officerOnCurrentRosters = readCSV(
  "/Users/claireholt/officer_on_current_roster.csv"
);

const officersData = readCSV("/Users/claireholt/new_officers.csv");

const casesOfficers = readCSV(
  "/Users/claireholt/cases_officers_table_noipm_copy.csv"
);

officerOnCurrentRosters.forEach(officerOnCurrentRoster => {
  // Lookup cases officers for current officer
  let matchingCasesOfficer = casesOfficers.filter(
    casesOfficer => casesOfficer['"officer_id"'] === officerOnCurrentRoster.id
  );

  // Find matching officer in officersData
  if (!officerOnCurrentRoster.windows_username) {
    let matchingOfficer = officersData.filter(
      officer =>
        officer.first_name === officerOnCurrentRoster.first_name &&
        officer.middle_name === officerOnCurrentRoster.middle_name &&
        officer.last_name === officerOnCurrentRoster.last_name
    );

    // If there are multiple matching officers, check for hire date
    if (matchingOfficer.length > 1) {
      if (officerOnCurrentRoster.hire_date) {
        const matchingHireDate = matchingOfficer.filter(
          officer => officer.hire_date === officerOnCurrentRoster.hire_date
        );
        if (matchingHireDate.length === 1) {
          matchingOfficer = matchingHireDate;
        }
      } else {
        console.log("This officer still has multiple matches!");
        console.log(
          "{\nSTART",
          officerOnCurrentRoster,
          matchingOfficer,
          "END\n}"
        );
      }
    }

    // If there is only one matching officer, update the officer
    if (matchingOfficer.length === 1) {
      matchingOfficer = matchingOfficer[0];
      if (officerOnCurrentRoster.updated_at >= matchingOfficer.updated_at) {
        matchingOfficer.supervisor_officer_number =
          officerOnCurrentRoster.supervisor_officer_number
            ? officerOnCurrentRoster.supervisor_officer_number
            : matchingOfficer.supervisor_officer_number;
        matchingOfficer.rank = officerOnCurrentRoster.rank
          ? officerOnCurrentRoster.rank
          : matchingOfficer.rank;
        matchingOfficer.district = officerOnCurrentRoster.district
          ? officerOnCurrentRoster.district
          : matchingOfficer.district;
        matchingOfficer.bureau = officerOnCurrentRoster.bureau
          ? officerOnCurrentRoster.bureau
          : matchingOfficer.bureau;
        matchingOfficer.work_status = officerOnCurrentRoster.work_status
          ? officerOnCurrentRoster.work_status
          : matchingOfficer.work_status;
        matchingOfficer.bureau = officerOnCurrentRoster.bureau
          ? officerOnCurrentRoster.bureau
          : matchingOfficer.bureau;
        matchingOfficer.updated_at = officerOnCurrentRoster.updated_at
          ? officerOnCurrentRoster.updated_at
          : matchingOfficer.updated_at;
        matchingOfficer.employee_type = officerOnCurrentRoster.employee_type
          ? officerOnCurrentRoster.employee_type
          : matchingOfficer.employee_type;
        matchingOfficer.end_date = officerOnCurrentRoster.end_date
          ? officerOnCurrentRoster.end_date
          : matchingOfficer.end_date;
        newToOfficersMerge.push(matchingOfficer);
      }
      matchingCasesOfficer.forEach(casesOfficer => {
        let casesOfficerChanged = casesOfficer;
        casesOfficerChanged['"officer_id"'] = matchingOfficer.id;
        casesOfficersAddon.push(casesOfficerChanged);
      });
    } else {
      console.log("No matching officer found for", officerOnCurrentRoster);
    }
  }
});

// Preserve officers that didn't need to be merged from officers_on_current_roster
officersData.forEach(officer => {
  let merger = newToOfficersMerge.filter(
    officerToMerge =>
      officerToMerge.windows_username === officer.windows_username
  );
  if (merger.length === 1) {
    merger = merger[0];
    newOfficersMerged.push(merger);
  } else {
    newOfficersMerged.push(officer);
  }
});

// Write to new CSV files
const newOfficersMergedStream = fs.createWriteStream(
  "/Users/claireholt/new_officers_merged.csv"
);
newOfficersMerged.forEach(row => {
  const rowArray = Object.values(row);
  newOfficersMergedStream.write(rowArray.join(",") + "\n");
});
newOfficersMergedStream.end();

const casesOfficersAddonStream = fs.createWriteStream(
  "/Users/claireholt/cases_officers_addon.csv" // replace with your path
);
casesOfficersAddon.forEach(row => {
  const rowArray = Object.values(row);
  casesOfficersAddonStream.write(rowArray.join(",") + "\n");
});
casesOfficersAddonStream.end();

console.log("Script completed successfully.");
