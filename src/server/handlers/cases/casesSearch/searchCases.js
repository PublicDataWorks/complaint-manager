import { getResultsFromES } from "../../getResultsFromES";
import { getPrimaryComplainant } from "../../../../sharedUtilities/getPrimaryComplainant";
import { getSortingOrderForQuery } from "../helpers/getSortingOrderForQuery";
import { DEFAULT_PAGINATION_LIMIT } from "../../../../sharedUtilities/constants";
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../policeDataManager/models/index");

const searchCases = asyncMiddleware(async (request, response) => {
  const { queryString, sortBy, sortDirection, currentPage = 1 } = request.query;

  const [searchResults, totalRecords] = await getResultsFromES(
    queryString,
    currentPage
  );

  const offset = (currentPage - 1) * DEFAULT_PAGINATION_LIMIT;
  const limit = DEFAULT_PAGINATION_LIMIT;

  const caseIds = [...new Set(searchResults.map(result => result.case_id))]; // Filter duplicate ids

  const rows = await models.sortable_cases_view.findAll({
    where: { id: caseIds },
    order: getSortingOrderForQuery(sortBy, sortDirection),
    offset,
    limit
  });

  response.send({ rows, totalRecords });
});

export default searchCases;
