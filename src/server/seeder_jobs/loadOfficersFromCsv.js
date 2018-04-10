const fs = require('fs');
const csvParse = require('csv-parse');
const models = require('../models/index');
const path = require('path');

const loadOfficersFromCsv = async (fileName) => {
    const filePath = path.join(__dirname, fileName);
    try {
        const parser = csvParse({columns: true, trim: true});
        const officers = [];

        const stream = fs.createReadStream(filePath)
            .pipe(parser)
            .on('data', async (officerData) => {
                officers.push(officerData)
            });

       await new Promise((resolve) => {
            stream.on('end', async () => {
                const insertedOfficers = await models.officer.bulkCreate(officers)
                resolve(insertedOfficers)
            })
        });
    } catch (error) {
        console.log("Error", error);
    }
};

module.exports = loadOfficersFromCsv;