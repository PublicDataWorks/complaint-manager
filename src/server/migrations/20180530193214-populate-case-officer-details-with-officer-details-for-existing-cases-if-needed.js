"use strict";

const formatQueryColumn = require("../../sharedUtilities/formatQueryColumn");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const allCaseOfficers = await queryInterface.sequelize.query(
      `SELECT id AS case_officer_id, officer_id from cases_officers`
    );

    allCaseOfficers[0].forEach(async caseOfficer => {
      const officerDataResults = await queryInterface.sequelize.query(`SELECT 
         first_name, middle_name, last_name, windows_username, employee_type, district, 
         bureau, rank, dob, end_date, sex, race, work_status, supervisor_officer_number
        from officers where id=${caseOfficer.officer_id}`);
      const officer = officerDataResults[0][0];

      let supervisorFirstName = null;
      let supervisorMiddleName = null;
      let supervisorLastName = null;
      let supervisorWindowsUsername = null;

      if (Boolean(officer.supervisor_officer_number)) {
        const supervisorOfficerDataResults = await queryInterface.sequelize.query(
          `SELECT first_name, middle_name, last_name, windows_username from officers where officer_number=${
            officer.supervisor_officer_number
          }`
        );
        const supervisorOfficer = supervisorOfficerDataResults[0][0];
        supervisorFirstName = supervisorOfficer.first_name;
        supervisorMiddleName = supervisorOfficer.middle_name;
        supervisorLastName = supervisorOfficer.last_name;
        supervisorWindowsUsername = supervisorOfficer.windows_username;
      }

      const formattedFirstName = formatQueryColumn(
        "first_name",
        officer.first_name
      );
      const formattedMiddleName = formatQueryColumn(
        "middle_name",
        officer.middle_name
      );
      const formattedLastName = formatQueryColumn(
        "last_name",
        officer.last_name
      );
      const formattedWindowsUserName = formatQueryColumn(
        "windows_username",
        officer.windows_username
      );
      const formattedEmployeeType = formatQueryColumn(
        "employee_type",
        officer.employee_type
      );
      const formattedDistrict = formatQueryColumn("district", officer.district);
      const formattedBureau = formatQueryColumn("bureau", officer.bureau);
      const formattedRank = formatQueryColumn("rank", officer.rank);
      const formattedDOB = formatQueryColumn("dob", officer.dob);
      const formattedEndDate = formatQueryColumn("end_date", officer.end_date);
      const formattedSex = formatQueryColumn("sex", officer.sex);
      const formattedRace = formatQueryColumn("race", officer.race);
      const formattedWorkStatus = formatQueryColumn(
        "work_status",
        officer.work_status
      );
      const formattedSupervisorOfficerNumber = formatQueryColumn(
        "supervisor_officer_number",
        officer.supervisor_officer_number
      );
      const formattedSupervisorFirstName = formatQueryColumn(
        "supervisor_first_name",
        supervisorFirstName
      );
      const formattedSupervisorMiddleName = formatQueryColumn(
        "supervisor_middle_name",
        supervisorMiddleName
      );
      const formattedSupervisorLastName = formatQueryColumn(
        "supervisor_last_name",
        supervisorLastName
      );
      const formattedSupervisorWindowsUsername = formatQueryColumn(
        "supervisor_windows_username",
        supervisorWindowsUsername
      );

      await queryInterface.sequelize.query(`
      UPDATE cases_officers
      SET ${formattedFirstName}, ${formattedMiddleName}, ${formattedLastName}, ${formattedWindowsUserName}, 
      ${formattedEmployeeType}, ${formattedDistrict}, ${formattedBureau}, ${formattedRank}, ${formattedDOB}, ${formattedEndDate}, 
      ${formattedSex}, ${formattedRace}, ${formattedWorkStatus}, ${formattedSupervisorOfficerNumber}, ${formattedSupervisorFirstName},
      ${formattedSupervisorMiddleName}, ${formattedSupervisorLastName}, ${formattedSupervisorWindowsUsername}
      WHERE id=${caseOfficer.case_officer_id}
      `);
    });
  },

  down: async (queryInterface, Sequelize) => {
    const allCaseOfficers = await queryInterface.sequelize.query(
      `SELECT id AS case_officer_id from cases_officers`
    );

    allCaseOfficers[0].forEach(async caseOfficer => {
      await queryInterface.sequelize.query(`
      UPDATE cases_officers
      SET first_name='', middle_name='', last_name='', windows_username=null, 
      employee_type=null, district='', bureau='', rank='', dob=null, end_date=null, 
      sex='', race='', work_status='', supervisor_officer_number=null, supervisor_first_name='',
      supervisor_middle_name='', supervisor_last_name='', supervisor_windows_username=null
      WHERE id=${caseOfficer.case_officer_id}
      `);
    });
  }
};
