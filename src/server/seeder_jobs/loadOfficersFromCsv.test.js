import loadOfficersFromCsv from "./loadOfficersFromCsv"
import models from '../models/index';

import {Op} from "sequelize"

describe("loadOfficersFromCsv", () => {
    afterEach(async () => {
        await models.officer.destroy({
            where: {
                officerNumber: {[Op.in]: [4638, 2597]}
            }
        });
    });

    test("it creates an officer for each row in the csv", async () => {
        await loadOfficersFromCsv('testOfficers.csv');
        const officers = await models.officer.findAll();
        expect(officers.length).toEqual(2);

        const officer1 = officers[0].dataValues;
        expect(officer1.firstName).toEqual('Claudell');
        expect(officer1.lastName).toEqual('Sorenson');
    })
});