const fs = require("fs");

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

// Function to clean up officers and cases_officers CSVs
function cleanUpOfficers() {
  try {
    // Step 1: Read officers and cases_officers CSVs
    const officersData = readCSV(
      "/Users/claireholt/officers_table_noipm_copy.csv"
    );

    const casesOfficersData = readCSV(
      "/Users/claireholt/cases_officers_table_noipm_copy.csv"
    );

    // Step 2: Initialize arrays to store processed data
    const uniqueBadgeNumbers = [];
    const newOfficersData = [];
    const newCasesOfficersData = [];
    const specialCases = [];
    let i = 0;

    // Step 3: Iterate through officers table
    for (const officer of officersData) {
      // Step 4: Check for duplicate badge numbers

      if (!uniqueBadgeNumbers.includes(officer.windows_username)) {
        uniqueBadgeNumbers.push(officer.windows_username);

        // Step 5: Check for duplicate officers and process
        let duplicates = officersData.filter(
          o => o.windows_username === officer.windows_username
        );

        // if any duplicates don't have same name, add all to special cases csv
        let sameNameDuplicates = duplicates.filter(
          o =>
            o.first_name === officer.first_name &&
            o.last_name === officer.last_name &&
            o.middle_initial === officer.middle_initial
        );

        if (sameNameDuplicates.length !== duplicates.length) {
          // add all duplicates to special cases
          for (const duplicate of duplicates) {
            specialCases.push(duplicate);
          }
        } else if (duplicates.length > 1) {
          // Step 6: Compare and find the most recently updated officer
          let mostRecentOfficer = duplicates.reduce((prev, curr) =>
            curr.updated_at > prev.updated_at ? curr : prev
          );

          // Step 7: Add the most recently updated officer to the new officers CSV
          newOfficersData.push(mostRecentOfficer);

          // Step 8: Process cases_officers data for duplicated officers
          for (const duplicate of duplicates) {
            const matchingCasesOfficers = casesOfficersData.filter(
              co => co['"officer_id"'] === duplicate.id
            );

            // Step 9: Create a copy of each matching row with altered officer_id
            for (const matchingCaseOfficer of matchingCasesOfficers) {
              let newCaseOfficer = {
                ...matchingCaseOfficer
              };
              newCaseOfficer.officer_id = mostRecentOfficer.id;
              console.log("matchingCaseOfficer: ", matchingCaseOfficer);

              newCasesOfficersData.push(newCaseOfficer);
            }
          }
        } else {
          // Step 10: If officer is not duplicated, add them to the new officers CSV
          newOfficersData.push(officer);

          // Step 11: Process cases_officers for the non-duplicated officer
          const matchingCasesOfficers = casesOfficersData.filter(
            co => co['"officer_id"'] === officer.id
          );
          newCasesOfficersData.push(...matchingCasesOfficers);
        }
      }
    }

    // Step 12: Write the cleaned data to new CSVs
    const officerStream = fs.createWriteStream(
      "/Users/claireholt/new_officers.csv"
    );
    newOfficersData.forEach(row => {
      const rowArray = Object.values(row);
      officerStream.write(rowArray.join(",") + "\n");
    });
    officerStream.end();

    const casesOfficersStream = fs.createWriteStream(
      "/Users/claireholt/new_cases_officers_updated_with_elseif.csv"
    );

    newCasesOfficersData.forEach(row => {
      const rowArray = Object.values(row);
      casesOfficersStream.write(rowArray.join(",") + "\n");
    });
    casesOfficersStream.end();

    // Step 13: Write special cases to a CSV
    const specialCasesStream = fs.createWriteStream(
      "/Users/claireholt/special_cases.csv"
    );
    specialCases.forEach(row => {
      const rowArray = Object.values(row);
      specialCasesStream.write(rowArray.join(",") + "\n");
    });

    specialCasesStream.end();

    console.log("Cleanup completed successfully.");
  } catch (error) {
    console.error("Error:", error);
  }
}

cleanUpOfficers();
