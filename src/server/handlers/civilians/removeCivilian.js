const models = require("../../models")

const removeCivilian = async (request, response, next) => {
    try {
        await models.civilian.destroy({ where: {id: request.params.civilianId}})

        const caseDetails = await models.cases.findById(
            request.params.caseId,
            {
                include: [
                    {
                        model: models.civilian,
                        include: [models.address]
                    },
                    {
                        model: models.attachment
                    },
                    {
                        model: models.address,
                        as: 'incidentLocation'
                    },
                    {
                        model: models.case_officer,
                        as: "accusedOfficers",
                        include: [models.officer]
                    }]

            })

        response.status(200).send(caseDetails)
    }
    catch (error) {
        next(error)
    }
}

module.exports = removeCivilian