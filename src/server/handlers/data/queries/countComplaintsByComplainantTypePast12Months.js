import sequelize from "sequelize";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import models from "../../../policeDataManager/models";
import moment from "moment";
import _ from "lodash";
const { PERSON_TYPE } = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);


export const dateRange = start => {
  let startDate = moment(start).format("YYYY-MM-DD");

  let counts = [];
  let dateToIndex = {};

  for (let i = 0; i <= 12; i++) {
    counts.push({ date: moment(startDate).format("MMM YY"), count: 0 });
    dateToIndex[moment(startDate).format("YYYY-MM")] = i;

    startDate = moment(startDate).add(1, "month");
  }
  return { counts, dateToIndex };
};

export const getAllComplaints = async (startDate, endDate, nickname) => {
  const where = {
    deletedAt: null,
    firstContactDate: {
      [sequelize.Op.gte]: startDate,
      [sequelize.Op.lte]: endDate
    },
    status: [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED]
  };

  const queryOptions = {
    attributes: ["id", "caseReferencePrefix", "firstContactDate"],
    include: [
      {
        model: models.civilian,
        as: "complainantCivilians",
        attributes: ["isAnonymous", "createdAt"]
      },
      {
        model: models.case_officer,
        as: "complainantOfficers",
        attributes: [
          "isAnonymous",
          "caseEmployeeType",
          "createdAt",
          "officerId"
        ]
      }
    ],
    paranoid: false,
    where: where
  };

  const complaints = await models.sequelize.transaction(async transaction => {
    return await models.cases.findAll(queryOptions);
  });
  return complaints;
};

export const executeQuery = async nickname => {
  const date = new Date();

  const endDate = date.setFullYear(date.getFullYear(), date.getMonth(), 0);

  const startDate = date.setFullYear(
    date.getFullYear() - 1,
    date.getMonth(),
    1
  );

  let { counts, dateToIndex } = dateRange(startDate);

  let totalComplaints = {
    [PERSON_TYPE.CIVILIAN.abbreviation]: _.cloneDeep(counts),
    [PERSON_TYPE.KNOWN_OFFICER.abbreviation]: _.cloneDeep(counts),
    [PERSON_TYPE.CIVILIAN_WITHIN_PD.abbreviation]: _.cloneDeep(counts),
    AC: _.cloneDeep(counts)
  };

  const complaints = await getAllComplaints(startDate, endDate, nickname);

  const numComplaints = complaints.length;
  for (let i = 0; i < numComplaints; i++) {
    const complaint = complaints[i];
    const complainantType = complaint.get("caseReferencePrefix");
    const formattedFirstContactDate = moment(complaint.firstContactDate).format(
      "YYYY-MM"
    );
    totalComplaints[complainantType][dateToIndex[formattedFirstContactDate]][
      "count"
    ] += 1;
  }

  return totalComplaints;
};
