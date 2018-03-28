import React from 'react'
import {MenuItem} from "material-ui";

const generateMenu = contents => {
    return contents.map((content) => {
        return (
            <MenuItem
                key={content}
                value={content}
            >{content}</MenuItem>)
    })
}

export const genderIdentityMenu = generateMenu([
    'Female',
    'Male',
    'Trans Female',
    'Trans Male',
    'Other',
    'Unknown'
])

export const raceEthnicityMenu = generateMenu([
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
    'Unknown'
])