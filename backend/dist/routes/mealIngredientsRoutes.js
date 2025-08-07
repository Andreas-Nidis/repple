"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const mealIngredientsController_1 = require("../controllers/mealIngredientsController");
const router = express_1.default.Router();
router.get('/:mealId', authMiddleware_1.authenticateFirebase, mealIngredientsController_1.getMealIngredients);
router.post('/:mealId/:ingredientId', authMiddleware_1.authenticateFirebase, mealIngredientsController_1.addIngredient);
router.put('/:mealId/:ingredientId', authMiddleware_1.authenticateFirebase, mealIngredientsController_1.updateIngredient);
router.delete('/:mealId/:ingredientId', authMiddleware_1.authenticateFirebase, mealIngredientsController_1.removeIngredient);
exports.default = router;
