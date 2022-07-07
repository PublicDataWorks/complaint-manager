import timezone from "moment-timezone";
import moment from "moment";
import { TIMEZONE } from "./constants";

const formatDate = dateString => {
  if (dateString) {
    dateString = timezone.tz(dateString, TIMEZONE).format("MMM D, YYYY");
  }
  return dateString;
};

export const formatShortDate = date => {
  if (!date) {
    return date;
  }
  return timezone.tz(date, TIMEZONE).format("MM/DD/YYYY");
};

export const formatLongDate = dateString => {
  if (dateString) {
    dateString = timezone.tz(dateString, TIMEZONE).format("MMMM DD, YYYY");
  }
  return dateString;
};

export const dateTimeFromString = (dateTimeString, userTimezone) => {
  return dateTimeString
    ? timezone.tz(dateTimeString, userTimezone).format("MMM D, YYYY h:mm A z")
    : null;
};

export const timeFromDateString = dateString => {
  return dateString
    ? timezone.tz(dateString, TIMEZONE).format("h:mm A z")
    : null;
};

export const applyCentralTimeZoneOffset = dateString => {
  if (!dateString) {
    return dateString;
  }
  return timezone.tz(dateString, TIMEZONE).format();
};

export const computeTimeZone = () => {
  return timezone.tz.zone(TIMEZONE).abbrs[0];
};

export function format12HourTime(time) {
  const timeParts = time.split(":");
  const hour = parseInt(timeParts[0], 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const realHour = ((hour + 11) % 12) + 1;
  const prefix = realHour < 10 ? "0" : "";

  return prefix + realHour + ":" + timeParts[1] + " " + suffix;
}

export default formatDate;
