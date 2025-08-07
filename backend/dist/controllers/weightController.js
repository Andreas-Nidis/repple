"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllWeightEntries = getAllWeightEntries;
exports.createWeightEntryHandler = createWeightEntryHandler;
exports.updateWeightEntryHandler = updateWeightEntryHandler;
exports.deleteWeightEntryHandler = deleteWeightEntryHandler;
const weightQueries_1 = require("../db/weightQueries");
async function getAllWeightEntries(req, res, next) {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const result = await (0, weightQueries_1.getWeightEntries)(userId);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
}
async function createWeightEntryHandler(req, res, next) {
    const userId = req.user?.id;
    const { entryDate, weight } = req.body;
    if (!userId || !entryDate || !weight) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    try {
        await (0, weightQueries_1.createWeightEntry)(userId, entryDate, weight);
        res.sendStatus(200);
    }
    catch (error) {
        next(error);
    }
}
async function updateWeightEntryHandler(req, res, next) {
    const userId = req.user?.id;
    const { entryDate } = req.params;
    const { weight } = req.body;
    if (!userId || !entryDate || !weight) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    try {
        await (0, weightQueries_1.updateWeightEntry)(userId, entryDate, weight);
        res.sendStatus(200);
    }
    catch (error) {
        next(error);
    }
}
async function deleteWeightEntryHandler(req, res, next) {
    const userId = req.user?.id;
    const { entryDate } = req.params;
    if (!userId || !entryDate) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    try {
        await (0, weightQueries_1.deleteWeightEntries)(userId, entryDate);
        res.status(200).json({ message: 'Weight entry deleted successfully.' });
    }
    catch (error) {
        next(error);
    }
}
