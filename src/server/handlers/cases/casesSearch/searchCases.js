import { getResultsFromES } from "../../getResultsFromES";
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../policeDataManager/models/index");

const searchCases = asyncMiddleware(async (request, response) => {
  const { queryString, currentPage } = request.query;

  const [searchResults, totalRecords] = await getResultsFromES(
    queryString,
    currentPage
  );

  const caseIds = [...new Set(searchResults.map(result => result.case_id))]; // Filter duplicate ids

  const caseDetails = await models.cases.findAll({ where: { id: caseIds } });

  const allCases = caseDetails.reduce((_allCases, caseDetail) => {
    _allCases[caseDetail.id] = caseDetail.dataValues;
    return _allCases;
  }, {});

  const rows = searchResults.map(({ case_id, ...result }) => ({
    ...result,
    ...allCases[case_id]
  }));

  response.send({ rows, totalRecords });
});

export default searchCases;
