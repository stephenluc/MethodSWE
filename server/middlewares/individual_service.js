const Method = require('./method_services');
const Individual = require('../models/IndividualModel');

const { promisify } = require('util');
const sleep = promisify(setTimeout);

const cache = new Map();

const HARD_CODE_PHONE_NUMBER = '+15121231111'; // per instructions

function formatDate(date) {
    const dateSplit = date.split('-');
    return `${dateSplit[2]}-${dateSplit[0]}-${dateSplit[1]}`;
}

async function getIndividual(dunkinId) {
    return await Individual.findOne({ dunkinId });
}

async function createIndividual(methodIndividual, dunkinId, branchId) {
    const {
        id,
        individual
    } = methodIndividual;
    const individualMap = {
        firstName: individual.first_name,
        lastName: individual.last_name,
        phoneNumber: individual.phone,
        dob: individual.dob,
    };
    const ind = new Individual({
        entId: id,
        individual: individualMap,
        dunkinId,
        branchId
    });
    await ind.save();
    cache.set(dunkinId, ind);
    return ind;
}

async function fetchIndividual(employee) {
    const dunkinId = employee.DunkinId;
    const individual = await getIndividual(dunkinId);
    try {
        if (!individual) {
            if (!cache.has(dunkinId)) {
                cache.set(dunkinId, false);
            } else {
                while(cache.has(dunkinId)){
                    await sleep(1500);
                    if (cache.get(dunkinId) !== false){
                        return cache.get(dunkinId);
                    }
                }
            }
            const methodIndividual = await Method.createIndividual({
                type: 'individual',
                individual: {
                    first_name: employee.FirstName,
                    last_name: employee.LastName,
                    phone: HARD_CODE_PHONE_NUMBER,
                    dob: formatDate(employee.DOB)
                }
            });
            return await createIndividual(methodIndividual, dunkinId, employee.DunkinBranch);
        }
    } catch (err) {
        console.error(`Error in individual fetch ${err}`)
        cache.delete(dunkinId);
    }
    return individual;
}

module.exports = { fetchIndividual }