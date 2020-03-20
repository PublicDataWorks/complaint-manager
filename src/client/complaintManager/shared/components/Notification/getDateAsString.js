export const getDateAsString = currentDate => {
  const date = new Date(currentDate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  let hour = date.getHours();
  const minutes = date.getMinutes();

  let timeOfDay;
  let updatedHour;
  if (parseInt(hour) > 12) {
    timeOfDay = "PM";
    updatedHour = (parseInt(hour) - 12).toString();
  } else {
    timeOfDay = "AM";
    updatedHour = hour;
  }

  return `${month}/${day}/${year} ${updatedHour}:${minutes} ${timeOfDay}`;
};
