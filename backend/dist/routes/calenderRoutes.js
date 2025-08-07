"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const calendarController_1 = require("../controllers/calendarController");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticateFirebase);
router.get('/', calendarController_1.getEntriesForWeekController);
router.post('/', calendarController_1.createCalendarEntryController);
router.patch('/:id/toggle', calendarController_1.toggleCompletionController);
router.delete('/:id', calendarController_1.deleteCalendarEntryController);
exports.default = router;
