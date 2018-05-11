import _ from "lodash";

const sortComplainantOfficers = (caseDetails) => {
    const civiliansAndOfficers = caseDetails.complainantWitnessOfficers.concat(caseDetails.civilians)

    return _.sortBy(civiliansAndOfficers, [getLastName, getFirstName])
}

export const isKnownOfficer = (civilianOrOfficer) => {
    return civilianOrOfficer.hasOwnProperty('officerId') && civilianOrOfficer.officer.fullName !== "Unknown Officer"
}

export const getLastName = (civilianOrOfficer) => {
    if (isKnownOfficer(civilianOrOfficer)) {
        return civilianOrOfficer.officer.lastName.toLowerCase()
    }

    if (civilianOrOfficer.hasOwnProperty('lastName')) {
        return civilianOrOfficer.lastName.toLowerCase()
    }
    return ""
}

export const getFirstName = (civilianOrOfficer) => {
    if (isKnownOfficer(civilianOrOfficer)) {
        return civilianOrOfficer.officer.firstName.toLowerCase()
    }
    if (civilianOrOfficer.hasOwnProperty('firstName')) {
        return civilianOrOfficer.firstName.toLowerCase()
    }
    return ""
}

export default sortComplainantOfficers