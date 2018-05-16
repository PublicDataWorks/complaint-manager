const formatCivilianName = civilian => {
  let { firstName, middleInitial, lastName, suffix } = civilian;
  middleInitial = middleInitial ? middleInitial + "." : "";

  const allNames = [firstName, middleInitial, lastName, suffix];

  const existingNames = allNames.filter(name => Boolean(name));

  return existingNames.reduce((accumulator, currentName, currentIndex) => {
    if (currentName) {
      accumulator += currentName;
    }

    if (currentIndex !== existingNames.length - 1) {
      accumulator += " ";
    }

    return accumulator;
  }, "");
};

export default formatCivilianName;
