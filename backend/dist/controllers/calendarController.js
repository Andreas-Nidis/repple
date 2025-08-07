"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntriesForWeekController = getEntriesForWeekController;
exports.createCalendarEntryController = createCalendarEntryController;
exports.toggleCompletionController = toggleCompletionController;
exports.deleteCalendarEntryController = deleteCalendarEntryController;
const calendarQueries_1 = require("../db/calendarQueries");
async function getEntriesForWeekController(req, res, next) {
    try {
        const userId = req.user?.id;
        const { startDate, endDate } = req.query;
        const entries = await (0, calendarQueries_1.getEntriesForWeek)(userId, String(startDate), String(endDate));
        res.json(entries);
    }
    catch (error) {
        next(error);
    }
}
async function createCalendarEntryController(req, res, next) {
    try {
        const userId = req.user?.id;
        const { workout_id, scheduled_date } = req.body;
        const entry = await (0, calendarQueries_1.createCalendarEntry)(userId, workout_id, scheduled_date);
        res.status(201).json(entry);
    }
    catch (error) {
        next(error);
    }
}
async function toggleCompletionController(req, res, next) {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const updated = await (0, calendarQueries_1.toggleCompletion)(userId, id);
        res.json(updated);
    }
    catch (error) {
        next(error);
    }
}
async function deleteCalendarEntryController(req, res, next) {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const deleted = await (0, calendarQueries_1.deleteCalendarEntry)(userId, id);
        res.json(deleted);
    }
    catch (error) {
        next(error);
    }
}
