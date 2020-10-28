const formatStringToTitleCase = stringToFormat => {
  stringToFormat = stringToFormat.toLowerCase().split("/");
  let titleCaseArray = stringToFormat.map(
    word => word[0].toUpperCase() + word.slice(1)
  );
  let titleCase = titleCaseArray.join("/");

  titleCaseArray = titleCase.split(" ");
  titleCaseArray = titleCaseArray.map(word => {
    return word[0] ? word[0].toUpperCase() + word.slice(1) : word;
  });
  return titleCaseArray.join(" ");
};

export default formatStringToTitleCase;
