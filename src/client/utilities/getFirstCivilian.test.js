import Civilian from "../testUtilities/civilian";
import getFirstCivilian from "./getFirstCivilian";

describe('getFirstCivilian', () => {
    test('should find a complainant if civilians with multiple roles on case exist', () => {
        const complainant = new Civilian.Builder().defaultCivilian().withRoleOnCase('Complainant')
        const witness = new Civilian.Builder().defaultCivilian().withRoleOnCase('Witness')
        const civilians = [complainant, witness]

        const result = getFirstCivilian(civilians)

        expect(result).toEqual(complainant)
    })

    test('should find a civilian if only civilians who are not complainants exist', () => {
        const witness = new Civilian.Builder().defaultCivilian().withRoleOnCase('Witness')
        const civilians = [witness]
        const result = getFirstCivilian(civilians)

        expect(result).toEqual(witness)
    })

    test('should never return undefined', () => {
        expect(getFirstCivilian([])).not.toBeUndefined()
    })
})