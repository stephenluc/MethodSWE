const Method = require('./method_services');
const Corporation = require('../models/CorporationModel');

async function getCorporation(dunkinId) {
    return await Corporation.findOne({ corpId: dunkinId });
}

async function createCorporation(entId, corpId) {
    const corporation = new Corporation({
        entId,
        corpId
    });
    corporation.save();
    return corporation;
}

async function fetchCorporation(payor) {
    const dunkinId = payor.DunkinId;
    const corporation = await getCorporation(dunkinId);
    if (!corporation) {
        const address = payor.Address
        const methodEntity = await Method.createCorporation({
            type: 'c_corporation',
            corporation: {
                name: payor.Name,
                dba: payor.DBA,
                ein: payor.EIN,
                owners: [],
            },
            address: {
                line1: address.Line1,
                line2: null,
                city: address.City,
                state: address.State,
                zip: '50613' // MethodInvalidRequestError: Invalid zip code for state provided.
            }
        });
        return await createCorporation(methodEntity.id, dunkinId)
    }
    return corporation;
}

module.exports = { fetchCorporation }