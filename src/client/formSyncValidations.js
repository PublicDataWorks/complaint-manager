import _ from 'lodash'

export function atLeastOneRequired(values, errorMessage, keys) {
    const allAbsent = keys.every( key => !(_.get(values, key)));

    const errors = {};
    if (allAbsent) {
        keys.forEach(key => _.set(errors, key, errorMessage));
    }

    return errors
}