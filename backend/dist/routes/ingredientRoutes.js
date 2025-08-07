"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const ingredientController_1 = require("../controllers/ingredientController");
const router = express_1.default.Router();
router.get('/', authMiddleware_1.authenticateFirebase, ingredientController_1.getAllIngredients);
router.get('/:ingredientId', authMiddleware_1.authenticateFirebase, ingredientController_1.getIngredient);
router.post('/', authMiddleware_1.authenticateFirebase, ingredientController_1.createNewIngredient);
router.put('/:ingredientId', authMiddleware_1.authenticateFirebase, ingredientController_1.updateExistingIngredient);
router.delete('/:ingredientId', authMiddleware_1.authenticateFirebase, ingredientController_1.deleteExistingIngredient);
exports.default = router;
