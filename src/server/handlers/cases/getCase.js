const getCaseWithAllAssociations = require('../getCaseWithAllAssociations')

const getCase = async (req, res) => {
    const singleCase = await getCaseWithAllAssociations(req.params.id)

    res.send(singleCase)
}

module.exports = getCase