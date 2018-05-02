import React from 'react'
import {MenuItem} from "material-ui";

export const generateMenu = contents => {
    return contents.map((content) => {
        let value, text;
        if (typeof(content) === 'string') {
            value = text = content
        } else {
            text = content[0]
            value = content[1]
        }
        return (
            <MenuItem
                key={value}
                value={value}
            >{text}</MenuItem>)
    })
}

export const genderIdentityMenu = generateMenu([
    'Unknown',
    'Female',
    'Male',
    'Trans Female',
    'Trans Male',
    'Other',
])

export const raceEthnicityMenu = generateMenu([
    'Unknown',
    'American Indian or Alaska Native',
    'Asian Indian',
    'Black, African American',
    'Chinese',
    'Cuban',
    'Filipino',
    'Guamanian or Chamorro',
    'Hispanic, Latino, or Spanish origin',
    'Japanese',
    'Korean',
    'Mexican, Mexican American, Chicano',
    'Native Hawaiian',
    'Puerto Rican',
    'Vietnamese',
    'Samoan',
    'White',
    'Other Pacific Islander',
    'Other Asian',
    'Other',
])

export const searchDistrictMenu = generateMenu([
    ['Any District', ''],
    ['1st District', 'First District'],
    ['2nd District', 'Second District'],
    ['3rd District', 'Third District'],
    ['4th District', 'Fourth District'],
    ['5th District', 'Fifth District'],
    ['6th District', 'Sixth District'],
    ['7th District', 'Seventh District'],
    ['8th District', 'Eighth District']
])

export const inputDistrictMenu = generateMenu([
    ['Unknown', ''],
    ['1st District', 'First District'],
    ['2nd District', 'Second District'],
    ['3rd District', 'Third District'],
    ['4th District', 'Fourth District'],
    ['5th District', 'Fifth District'],
    ['6th District', 'Sixth District'],
    ['7th District', 'Seventh District'],
    ['8th District', 'Eighth District']
])

export const userActions = generateMenu([
    'Case Briefing from NOPD',
    'Checked Status',
    'Contacted Complainant',
    'Contacted Complainant Support Person',
    'Contacted NOPD',
    'Contacted Outside Agency',
    'Gathered information from outside source',
    'Memo to file',
    'Pulled docket from the court website',
    'Pulled information from NOPD Databases',
    'Requested documents from Other Agency',
    'Requested information from NOPD',
    'Researched issue related to a complaint',
    'Sent Closeout Memo',
    'Sent Notice of Case Review',
    'Sent Notice of Monitoring',
    'Sent Supplemental Complaint Referral',
    'Miscellaneous'
])