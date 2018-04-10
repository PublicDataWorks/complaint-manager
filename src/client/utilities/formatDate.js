import moment from 'moment'
import timezone from 'moment-timezone'
import {TIMEZONE} from "../../sharedUtilities/constants";

const formatDate = dateString => {
    if (dateString) {
        const date = moment(moment.utc(new Date(dateString)).format('YYYY-MM-DDTHH:mm')).toDate()

        dateString = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return dateString
}

export const timeFromDateString = dateString => {
    return dateString
        ? timezone.tz(dateString, TIMEZONE).format('h:mm A z')
        : null
}

export const applyCentralTimeZoneOffset = dateString => {
    if (!dateString) { return dateString }
    return timezone.tz(dateString, TIMEZONE).format()
}

export const computeTimeZone = (date, time) => {
    if (!time) return time
    else {
        let timeZone = 'CT'

        if (date) {
            timeZone = moment(date).tz(TIMEZONE).format("z")
        }
        return timeZone
    }
}

export function format12HourTime(time) {
    const timeParts = time.split(":")
    const hour = parseInt(timeParts[0], 10)
    const suffix = hour >= 12 ? "PM" : "AM"
    const realHour = (hour + 11) % 12 + 1
    const prefix = realHour < 10 ? "0" : ""

    return prefix + realHour + ":" + timeParts[1] + " " + suffix
}

export default formatDate