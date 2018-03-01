import _ from 'lodash'

export function atLeastOneRequired(values, errorMessage, keys) {
    const bothAbsent = keys.every(key => !Boolean(_.get(values, key)))

    let errors = {}

    if (bothAbsent) {
        keys.forEach(key => _.set(errors, key, errorMessage))
    }

    return errors
}