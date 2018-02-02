import moment from 'moment'

const formatDate = dateString => {
    const date = moment(moment.utc(new Date(dateString)).format('YYYY-MM-DD')).toDate()

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

export default formatDate