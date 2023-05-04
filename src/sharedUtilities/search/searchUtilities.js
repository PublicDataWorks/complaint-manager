const OPERATORS = ["AND", "OR", "NOT"];

export const parseSearchTerm = term => {
  if (!term) {
    return;
  }

  return term.replace(/\s+/g, " <<SPACE>> ");
};

const addSpaceIfNotEmpty = str => (str === "" ? "" : str + " ");

const addAsterisksAroundWordIfNonGrouping = word => {
  let processedWord = word;
  let prefix = "*";
  let postfix = "*";
  if (processedWord.startsWith('"')) {
    processedWord = processedWord.substring(1);
    prefix = '"*';
  } else if (processedWord.startsWith('("')) {
    processedWord = processedWord.substring(2);
    prefix = '("*';
  } else if (processedWord.startsWith("(")) {
    processedWord = processedWord.substring(1);
    prefix = "(*";
    1;
  }

  if (processedWord.endsWith('"')) {
    processedWord = processedWord.substring(0, processedWord.length - 1);
    postfix = '*"';
  } else if (processedWord.endsWith('")')) {
    processedWord = processedWord.substring(0, processedWord.length - 2);
    postfix = '*")';
  } else if (processedWord.endsWith(")")) {
    processedWord = processedWord.substring(0, processedWord.length - 1);
    postfix = "*)";
  }

  return `${prefix}${processedWord}${postfix}`;
};

const findEndOfNOTTerm = (str, start) => {
  let idx = start;
  while (str.charAt(idx) === " " && idx < str.length) {
    idx++;
  }

  let objective = " ";
  if (str.charAt(idx) === "(") {
    objective = ")";
  } else if (str.charAt(idx) === '"') {
    objective = '"';
  }

  while (str.charAt(++idx) !== objective && idx < str.length);

  return idx;
};

const parenthesizeAroundNOT = queryString => {
  let result = queryString;
  let regex = new RegExp(/NOT\s+/g);
  let match = regex.exec(result);
  let i = 0;
  while (match && i < 10) {
    let endIdx = findEndOfNOTTerm(result, regex.lastIndex);
    let startIdx = regex.lastIndex - match[0].length;
    result = `${result.substring(0, startIdx)}(${result.substring(
      startIdx,
      endIdx
    )})${result.substring(endIdx)}`;
    match = regex.exec(result);
    i++;
  }
  return result;
};

const processFieldQuery = word => {
  let [field, term] = word.split(":");
  term = ensureCompleteQuotes(term);
  return `${
    field.startsWith("narrative.") ? field : `${field}.\\*`
  }:${addAsterisksAroundWordIfNonGrouping(term)}`;
};

const ensureCompleteQuotes = term => {
  if (term[term.length - 1] === '"') {
    if (term[0] !== '"') {
      term = '"' + term;
    }
  } else if (term[0] === '"') {
    if (term[term.length - 1] !== '"') {
      term = term + '"';
    }
  }
  return term;
};

export const buildQueryString = query => {
  let quoteArr = query.split('"');
  for (let i = 1; i < quoteArr.length; i += 2) {
    quoteArr[i] = parseSearchTerm(quoteArr[i]);
  }
  let queryString = quoteArr.join('"');
  return parenthesizeAroundNOT(
    queryString.split(" ").reduce((str, word) => {
      if (OPERATORS.includes(word) || word.endsWith("NOT")) {
        return `${addSpaceIfNotEmpty(str)}${word}`;
      } else if (word.includes(":")) {
        return `${addSpaceIfNotEmpty(str)}${processFieldQuery(word)}`;
      } else {
        return `${addSpaceIfNotEmpty(str)}${addAsterisksAroundWordIfNonGrouping(
          word
        )}`;
      }
    }, "")
  );
};

export const removeTags = query =>
  query
    ? query.replace(/<\/?(p|br)[^>]*>/gi, " ").replace(/<[^>]*>/gi, "")
    : "";

export const updateSearchIndex = async (verbose = false) => {
  const environment = process.env.NODE_ENV || "development";
  const { indexName: index } = require("./search-index-config")[environment];

  let elasticClient;
  try {
    elasticClient = require("./create-configured-search-client")();
  } catch (err) {
    handleError(err);
  }

  process.on("uncaughtException", error => {
    console.error(typeof error);
    console.error(error);
    return 1;
  });

  function handleError(err) {
    console.error("Caught Error: ", err);
    return 1;
  }

  if (verbose) {
    console.log(`Checking for ${index} index...`);
  }

  const { body: isIndexThere } = await elasticClient.indices
    .exists({ index })
    .catch(handleError);

  if (isIndexThere) {
    console.log("Deleting previous version of index...");
    await elasticClient.indices.delete({ index }).catch(handleError);
  }

  if (verbose) {
    console.log(`Creating ${index} index...`);
  }

  await elasticClient.indices
    .create(
      {
        index,
        body: {
          mappings: {
            properties: {
              case_id: { type: "integer" },
              tag: {
                type: "nested",
                properties: {
                  name: { type: "text" }
                }
              },
              accused: {
                type: "nested",
                properties: {
                  full_name: { type: "text" },
                  full_name_with_initial: { type: "text" }
                },
                complainant: {
                  type: "nested",
                  properties: {
                    full_name: { type: "text" },
                    full_name_with_initial: { type: "text" }
                  }
                },
                narrative: {
                  type: "nested",
                  properties: {
                    summary: { type: "text" },
                    details: { type: "text" }
                  }
                }
              }
            }
          }
        }
      },
      { ignore: [400] }
    )
    .catch(handleError);

  if (verbose) {
    console.log(`Index ${index} created.`);
  }

  const models = require("../../server/policeDataManager/models/index");

  const results = await models.cases.findAll({
    attributes: [
      "id",
      "caseReference",
      "pibCaseNumber",
      "narrativeSummary",
      "narrativeDetails"
    ],
    include: [
      {
        model: models.case_tag,
        as: "caseTags",
        include: [
          {
            model: models.tag,
            as: "tag"
          }
        ]
      },
      {
        model: models.case_officer,
        as: "complainantOfficers"
      },
      {
        model: models.case_officer,
        as: "accusedOfficers"
      },
      {
        model: models.civilian,
        as: "complainantCivilians"
      },
      {
        model: models.civilian,
        as: "accusedCivilians"
      },
      {
        model: models.caseInmate,
        as: "complainantInmates",
        include: [
          {
            model: models.inmate,
            as: "inmate",
            include: ["facilityDetails"]
          }
        ]
      },
      {
        model: models.caseInmate,
        as: "accusedInmates",
        include: [
          {
            model: models.inmate,
            as: "inmate",
            include: ["facilityDetails"]
          }
        ]
      }
    ]
  });

  if (!results.length && verbose) {
    console.log("No results were found. Ending script.");
    return 0;
  }

  const operation = { index: { _index: index } };
  const mapPerson = person => {
    if (person?.inmate != null) {
      person = person.inmate;
    } else {
      person;
    }
    let results = {
      full_name: parseSearchTerm(
        `${person.firstName} ${person.lastName}${
          person.suffix ? ` ${person.suffix}` : ""
        }`
      )
    };
    let middle = person.middleName || person.middleInitial;
    if (middle) {
      results.full_name_with_initial = parseSearchTerm(
        `${person.firstName} ${middle} ${person.lastName}${
          person.suffix ? ` ${person.suffix}` : ""
        }`
      );
    }
    return results;
  };

  const bulkOperations = results.flatMap(result => {
    const case_id = result.id;
    const tag = result.caseTags.map(tag => ({
      name: parseSearchTerm(tag.tag.name)
    }));
    const complainantOfficers = result.complainantOfficers.map(mapPerson);
    const complainantInmates = result.complainantInmates.map(mapPerson);
    const accusedInmates = result.accusedInmates.map(mapPerson);
    const accusedOfficers = result.accusedOfficers.map(mapPerson);
    const complainantCivilians = result.complainantCivilians.map(mapPerson);
    const accusedCivilians = result.accusedCivilians.map(mapPerson);
    const narrative = {
      summary: parseSearchTerm(removeTags(result.narrativeSummary)),
      details: parseSearchTerm(removeTags(result.narrativeDetails))
    };
    let case_number = [result.caseReference];
    if (result.pibCaseNumber) {
      case_number.push(result.pibCaseNumber);
    }

    const document = {
      case_id,
      case_number,
      tag,
      accused: accusedOfficers.concat(accusedInmates, accusedCivilians),
      complainant: complainantOfficers.concat(
        complainantCivilians,
        complainantInmates
      ),
      narrative
    };

    return [operation, document];
  });

  if (verbose) {
    console.log(bulkOperations);
  }

  await elasticClient
    .bulk({ refresh: true, body: bulkOperations })
    .catch(handleError);

  const {
    body: { count: count }
  } = await elasticClient.count({ index }).catch(handleError);

  if (verbose) {
    console.log(`${count} records indexed.`);
  }

  return 0;
};
