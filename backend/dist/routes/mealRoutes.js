"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const mealController_1 = require("../controllers/mealController");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.authenticateFirebase, mealController_1.getMeals);
router.get('/:mealId', authMiddleware_1.authenticateFirebase, mealController_1.getMeal);
router.post('/', authMiddleware_1.authenticateFirebase, mealController_1.createMealHandler);
router.put('/:mealId', authMiddleware_1.authenticateFirebase, mealController_1.updateMealHandler);
router.delete('/:mealId', authMiddleware_1.authenticateFirebase, mealController_1.deleteMealHandler);
exports.default = router;
