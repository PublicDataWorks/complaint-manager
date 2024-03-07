const fs = require("fs");
const readline = require("readline");

//stolen from generate-officers-CSV-without-duplicates.js
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
// Function to read CSV file line by line and create an object for each line
function readCSVToObject(filename, onData) {
  const fileStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  rl.on("line", line => {
    const [
      id,
      officer_number,
      first_name,
      middle_name,
      last_name,
      rank,
      race,
      sex,
      dob,
      bureau,
      district,
      work_status,
      created_at,
      updated_at,
      supervisor_officer_number,
      hire_date,
      end_date,
      employee_type,
      windows_username,
      district_id
    ] = line.split(",");
    onData({
      id,
      officer_number,
      first_name,
      middle_name,
      last_name,
      rank,
      race,
      sex,
      dob,
      bureau,
      district,
      work_status,
      created_at,
      updated_at,
      supervisor_officer_number,
      hire_date,
      end_date,
      employee_type,
      windows_username,
      district_id
    });
  });

  rl.on("close", () => {
    console.log(`Finished reading ${filename}`);
  });
}

// Function to write an array of objects to a CSV file
function writeObjectArrayToCSV(filename, data) {
  const fileStream = fs.createWriteStream(filename);
  fileStream.write("first_name,last_name,windows_username\n"); // Writing header

  data.forEach(obj => {
    fileStream.write(
      `${obj.first_name},${obj.last_name},${obj.windows_username}\n`
    );
  });

  fileStream.end(() => {
    console.log(`Finished writing ${filename}`);
  });
}

// Arrays to store matched and missing officers
const officersOnRoster = [];
const missingOfficers = [];

// Read special_cases.csv and convert each line to an object
const specialCases = readCSV("/Users/claireholt/special_cases.csv");

// Read officers.csv and convert each line to an object
const officersData = readCSV("/Users/claireholt/new_officers.csv");

specialCases.forEach(specialCase => {
  console.log("specialCase: ", specialCase);
  if (!specialCase.windows_username) {
    const matchingOfficer = officersData.filter(
      officer =>
        officer.first_name === specialCase.first_name &&
        officer.last_name === specialCase.last_name
    );

    if (matchingOfficer) {
      officersOnRoster.push(specialCase);
    } else {
      missingOfficers.push(specialCase);
    }
  }
});

// Write to new CSV files
const officersOnRosterStream = fs.createWriteStream(
  "/Users/claireholt/officer_on_current_roster.csv"
);
officersOnRoster.forEach(row => {
  const rowArray = Object.values(row);
  officersOnRosterStream.write(rowArray.join(",") + "\n");
});
officersOnRosterStream.end();

const missingOfficersStream = fs.createWriteStream(
  "/Users/claireholt/missing_officers.csv"
);
missingOfficers.forEach(row => {
  const rowArray = Object.values(row);
  missingOfficersStream.write(rowArray.join(",") + "\n");
});
missingOfficersStream.end();

console.log("Script completed successfully.");
