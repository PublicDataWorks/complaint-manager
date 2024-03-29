import { CASE_STATUS, ISO_DATE } from "../../../../sharedUtilities/constants";
import models from "../../../policeDataManager/models";
import moment from "moment";
import _ from "lodash";
import {
  calculateFirstContactDateCriteria,
  getLegendValue
} from "./queryHelperFunctions";

export const getDateRange = dateRange => {
  let startDate = dateRange?.minDate
    ? moment(dateRange.minDate)
    : moment().subtract(12, "months");
  let endDate = dateRange?.maxDate ? moment(dateRange.maxDate) : moment();

  let counts = [];
  let dateToIndex = {};

  const numberOfMonths = endDate.diff(startDate, "months");
  for (let i = 0; i <= numberOfMonths; i++) {
    counts.push({ date: startDate.format("MMM YY"), count: 0 });
    dateToIndex[startDate.format("YYYY-MM")] = i;

    startDate = startDate.add(1, "month");
  }
  return { counts, dateToIndex };
};

export const getAllComplaints = async (
  dateRange,
  nickname,
  filterCaseByStatus
) => {
  const where = {
    deletedAt: null,
    firstContactDate: calculateFirstContactDateCriteria(
      dateRange,
      moment().subtract(12, "months")
    )
  };

  const queryOptions = {
    attributes: ["id", "caseReferencePrefix", "firstContactDate"],
    include: [
      {
        model: models.civilian,
        as: "complainantCivilians",
        attributes: ["isAnonymous", "createdAt"],
        include: ["personTypeDetails"]
      },
      {
        model: models.case_officer,
        as: "complainantOfficers",
        attributes: [
          "isAnonymous",
          "caseEmployeeType",
          "createdAt",
          "officerId"
        ],
        include: ["personTypeDetails"]
      },
      {
        model: models.caseInmate,
        as: "complainantInmates",
        attributes: ["isAnonymous", "inmateId", "createdAt"],
        include: ["personTypeDetails"]
      },
      {
        model: models.caseStatus,
        as: "status",
        attributes: [],
        where: { name: filterCaseByStatus }
      },
      {
        model: models.personType,
        as: "defaultPersonType"
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

export const executeQuery = async (
  nickname,
  dateRange,
  filterCaseByStatus = [CASE_STATUS.FORWARDED_TO_AGENCY, CASE_STATUS.CLOSED]
) => {
  let modifiedMinDate = dateRange?.minDate
    ? moment(dateRange.minDate).date(1).format(ISO_DATE)
    : moment().subtract(12, "months").date(1).format(ISO_DATE);
  let modifiedMaxDate = dateRange?.maxDate
    ? moment(dateRange.maxDate)
    : moment();
  modifiedMaxDate = modifiedMaxDate.date(1).subtract(1, "days");
  let modifiedDateRange = {
    maxDate: modifiedMaxDate,
    minDate: modifiedMinDate
  };
  let { counts, dateToIndex } = getDateRange(modifiedDateRange);

  const personTypes = await models.personType.findAll();

  let totalComplaints = personTypes.reduce(
    (acc, type) => {
      acc[type.legend] = _.cloneDeep(counts);
      return acc;
    },
    {
      "Anonymous (AC)": _.cloneDeep(counts)
    }
  );

  const complaints = await getAllComplaints(
    modifiedDateRange,
    nickname,
    filterCaseByStatus
  );

  const numComplaints = complaints.length;
  for (let i = 0; i < numComplaints; i++) {
    const complaint = complaints[i];
    const legend = getLegendValue(complaint);
    const formattedFirstContactDate = moment(complaint.firstContactDate).format(
      "YYYY-MM"
    );
    totalComplaints[legend][dateToIndex[formattedFirstContactDate]][
      "count"
    ] += 1;
  }

  return totalComplaints;
};
