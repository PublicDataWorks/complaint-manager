const formatDate = dateString => {
    const date = new Date(dateString)

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

export default formatDate