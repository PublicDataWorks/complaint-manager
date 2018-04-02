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

export default formatDate