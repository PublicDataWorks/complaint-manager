const shiftSingleElementOfArray = (array, target, finalDesiredIndex) => {
  const indexOfTargetElement = array.indexOf(target);
  if (indexOfTargetElement >= 0 && finalDesiredIndex <= array.length - 1) {
    const cutObject = array.splice(indexOfTargetElement, 1)[0];
    array.splice(finalDesiredIndex, 0, cutObject);
  }
};

export default shiftSingleElementOfArray;
