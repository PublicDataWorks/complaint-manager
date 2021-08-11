const SEARCH_TERMS = ["AND", "OR", "NOT"];

export const parseSearchTerm = term => {
  if (!term) {
    return;
  }

  return term.replace(/\s+/g, " <<SPACE>> ");
};

export const buildQueryString = query => {
  let quoteArr = query.split('"');
  for (let i = 1; i < quoteArr.length; i += 2) {
    quoteArr[i] = parseSearchTerm(quoteArr[i]);
  }
  let queryString = quoteArr.join('"');
  return queryString.split(" ").reduce((str, word) => {
    if (SEARCH_TERMS.includes(word)) {
      return `${str === "" ? "" : str + " "}${word}`;
    } else {
      return `${str === "" ? "" : str + " "}${
        word.startsWith('"') || word.startsWith("(") ? "" : "*"
      }${word}${word.endsWith('"') || word.endsWith(")") ? "" : "*"}`;
    }
  }, "");
};
