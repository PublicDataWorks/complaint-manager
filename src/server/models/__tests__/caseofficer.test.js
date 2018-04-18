import Case from "../../../client/testUtilities/case";
import Officer from "../../../client/testUtilities/Officer";

const models = require("../index")

describe('cases_officers', () => {
    let caseToCreate, officerToCreate, seededCase, seededOfficer

    beforeEach(async () => {
        caseToCreate = new Case.Builder().defaultCase().withId(undefined).withIncidentLocation(undefined).build();
        officerToCreate = new Officer.Builder().defaultOfficer().build()

        seededOfficer = await models.officer.create(officerToCreate)
        seededCase = await models.cases.create(caseToCreate)

        await seededCase.addOfficer(seededOfficer)
    })

    afterEach(async () => {
        await models.case_officer.destroy({
            where: {
                case_id: seededCase.id
            }
        })

        await models.cases.destroy({
            where: {
                id: seededCase.id
            }
        })

        await models.officer.destroy({
            where: {
                id: seededOfficer.id
            }
        })
    })

    test('it should be able to associate an officer to a case', async () => {
        const seededCaseWithOfficers = await models.cases.findById(seededCase.id,
            {
                include: [
                    {
                        model: models.officer
                    }
                ]
            }
        )

        expect(seededCaseWithOfficers.officers).toHaveLength(1)
        expect(seededCaseWithOfficers.get({ plain: true })).toEqual(
            expect.objectContaining({
                officers: expect.arrayContaining([
                    expect.objectContaining({
                        id: seededOfficer.id
                    })
                ])
            })
        )
    })
})
