"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const weightController_1 = require("../controllers/weightController");
const router = express_1.default.Router();
router.use(authMiddleware_1.authenticateFirebase);
router.get('/', weightController_1.getAllWeightEntries);
router.post('/', weightController_1.createWeightEntryHandler);
router.put('/:entryDate', weightController_1.updateWeightEntryHandler);
router.delete('/:entryDate', weightController_1.deleteWeightEntryHandler);
exports.default = router;
