import { getResultsFromES } from "../../getResultsFromES";
import { getPrimaryComplainant } from "../../../../sharedUtilities/getPrimaryComplainant";
import { getSortingOrderForQuery } from "../helpers/getSortingOrderForQuery";
import {
  ASCENDING,
  DESCENDING,
} from "../../../../sharedUtilities/constants";
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../policeDataManager/models/index");

const searchCases = asyncMiddleware(async (request, response) => {
  const { queryString, sortBy, sortDirection, currentPage } = request.query;

  const [searchResults, totalRecords] = await getResultsFromES(
    queryString,
    currentPage
  );

  
  let order;
  try {
    order = [
    ...getSortingOrderForQuery(sortBy, sortDirection)
  ];
}
catch (error){
    console.error(error);
}
    
  const caseIds = [...new Set(searchResults.map(result => result.case_id))]; // Filter duplicate ids

  const rows = await models.sortable_cases_view.findAll({
    where: { id: caseIds },
    order
  });

  const allSearchResults = searchResults.reduce(
    (_allSearchResults, searchResult) => {
      const otherData = _allSearchResults[searchResult.case_id] || {};
      _allSearchResults[searchResult.case_id] = {
        ...otherData,
        ...searchResult
      };
      return _allSearchResults;
    },
    {}
  );

  rows.forEach(caseDetail => {
    const { tag_name } = allSearchResults[caseDetail.id] || {};
    if (tag_name) caseDetail.tag_name = tag_name;
    caseDetail.dataValues.primaryComplainant = getPrimaryComplainant(
      caseDetail.dataValues
    );
  });

  response.send({ rows, totalRecords });
});

export default searchCases;
