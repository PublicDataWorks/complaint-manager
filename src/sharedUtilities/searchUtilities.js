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
      } else {
        return `${addSpaceIfNotEmpty(str)}${addAsterisksAroundWordIfNonGrouping(
          word
        )}`;
      }
    }, "")
  );
};
