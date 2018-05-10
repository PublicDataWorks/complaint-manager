import loadOfficersFromCsv from "./loadOfficersFromCsv"
import models from '../models/index';

describe("loadOfficersFromCsv", () => {
    afterEach(async () => {
        await models.case_officer.destroy({truncate: true, cascade: true});
        await models.officer.destroy({truncate: true, cascade: true});
    });

    test("it creates an officer for each row in the csv", async () => {
        await loadOfficersFromCsv('testOfficers.csv');
        const officers = await models.officer.findAll();
        expect(officers.length).toEqual(2);

        const officer1 = officers[0].dataValues;
        expect(officer1.firstName).toEqual('Chris');
        expect(officer1.lastName).toEqual('Paucek');
    })
});