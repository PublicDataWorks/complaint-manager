const OPERATORS = ["AND", "OR", "NOT"];

export const parseSearchTerm = term => {
  if (!term) {
    return;
  }

  return term.replace(/\s+/g, " <<SPACE>> ");
};

const addSpaceIfNotEmpty = str => (str === "" ? "" : str + " ");

const addAsterisksAroundWordIfNonGrouping = word => {
  let prefix = word.startsWith('"') || word.startsWith("(") ? "" : "*";
  let postfix = word.endsWith('"') || word.endsWith(")") ? "" : "*";
  return `${prefix}${word}${postfix}`;
};

export const buildQueryString = query => {
  let quoteArr = query.split('"');
  for (let i = 1; i < quoteArr.length; i += 2) {
    quoteArr[i] = parseSearchTerm(quoteArr[i]);
  }
  let queryString = quoteArr.join('"');
  return queryString.split(" ").reduce((str, word) => {
    if (OPERATORS.includes(word)) {
      return `${addSpaceIfNotEmpty(str)}${word}`;
    } else {
      return `${addSpaceIfNotEmpty(str)}${addAsterisksAroundWordIfNonGrouping(
        word
      )}`;
    }
  }, "");
};
