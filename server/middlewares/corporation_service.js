const Method = require('./method_services');
const Corporation = require('../models/CorporationModel');

async function getCorporation(dunkinId) {
    return await Corporation.findOne({ corpId: dunkinId });
}

async function createCorporation(methodCorporation, corpId) {
    const {
        id,
        corporation,
        address
    } = methodCorporation;
    const corpMap = {
        name: corporation.name,
        dba: corporation.dba,
        ein: corporation.ein,
    };
    const addressMap = {
        line1: address.line1,
        city: address.city,
        state: address.state,
        zip: address.zip,
    };
    const corp = new Corporation({
        entId: id,
        corpId,
        corporation: corpMap,
        address: addressMap
    });
    corp.save();
    return corp;
}

async function fetchCorporation(payor) {
    const dunkinId = payor.DunkinId;
    const corporation = await getCorporation(dunkinId);
    if (!corporation) {
        const address = payor.Address
        const methodCorporation = await Method.createCorporation({
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
        return await createCorporation(methodCorporation, dunkinId)
    }
    return corporation;
}

module.exports = { fetchCorporation }