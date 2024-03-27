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

const remappedSupervisorOfficers = [];

const officersCurrent = readCSV(
  "/Users/jeanwatts/Documents/Officer Tables/officers_table_noipm_copy - officers_table_noipm_copy.csv"
);

const officersUpdated = readCSV(
  "/Users/jeanwatts/Documents/Officer Tables/updated_officers_table_prod_03072024 - updated_officers_table_prod_03072024.csv"
);
officersUpdated.forEach(updatedOfficer => {
  //console.log(updatedOfficer);
  if (updatedOfficer.supervisor_officer_number) {
    let supervisor = officersUpdated.find(
      officer =>
        officer.officer_number === updatedOfficer.supervisor_officer_number
    );
    if (supervisor) {
      //console.log(supervisor);
      let officerTemp = updatedOfficer;
      officerTemp.supervisor_officer_number = supervisor.windows_username;
      remappedSupervisorOfficers.push(officerTemp);
    } else {
      supervisor = officersUpdated.find(
        officer =>
          officer.windows_username === updatedOfficer.supervisor_officer_number
      );
      supervisorOriginal = officersCurrent.find(
        officer =>
          officer.officer_number === updatedOfficer.supervisor_officer_number
      );
      if (supervisor) {
        remappedSupervisorOfficers.push(updatedOfficer);
      } else {
        console.log(updatedOfficer);
      }
    }
  } else {
    remappedSupervisorOfficers.push(updatedOfficer);
  }
});

// Write to new CSV files
const remappedSupervisorOfficersStream = fs.createWriteStream(
  "/Users/jeanwatts/Documents/Officer Tables/supervisor_changes.csv"
);
remappedSupervisorOfficers.forEach(row => {
  const rowArray = Object.values(row);
  remappedSupervisorOfficersStream.write(rowArray.join(",") + "\n");
});
remappedSupervisorOfficersStream.end();

console.log("Script completed successfully.");
