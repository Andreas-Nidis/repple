"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllIngredients = getAllIngredients;
exports.getIngredient = getIngredient;
exports.createNewIngredient = createNewIngredient;
exports.updateExistingIngredient = updateExistingIngredient;
exports.deleteExistingIngredient = deleteExistingIngredient;
const ingredientQueries_1 = require("../db/ingredientQueries");
async function getAllIngredients(req, res, next) {
    const userId = req.user?.id;
    try {
        const ingredients = await (0, ingredientQueries_1.getAllIngredientsByUserId)(userId);
        res.json(ingredients);
    }
    catch (error) {
        next(error);
    }
}
async function getIngredient(req, res, next) {
    const userId = req.user?.id;
    const ingredientId = req.params.ingredientId;
    try {
        const ingredient = await (0, ingredientQueries_1.getIngredientById)(userId, ingredientId);
        if (!ingredient) {
            res.status(404).json({ error: 'Ingredient not found' });
            return;
        }
        res.json(ingredient);
    }
    catch (error) {
        next(error);
    }
}
async function createNewIngredient(req, res, next) {
    const userId = req.user?.id;
    const { name } = req.body;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return;
    }
    try {
        const newIngredient = await (0, ingredientQueries_1.createIngredient)(userId, name);
        res.status(201).json(newIngredient);
    }
    catch (error) {
        next(error);
    }
}
async function updateExistingIngredient(req, res, next) {
    const userId = req.user?.id;
    const ingredientId = req.params.ingredientId;
    const { protein, carbs, fat } = req.body;
    try {
        const updatedIngredient = await (0, ingredientQueries_1.updateIngredient)(userId, ingredientId, protein, carbs, fat);
        if (!updatedIngredient) {
            res.status(404).json({ error: 'Ingredient not found' });
            return;
        }
        res.json(updatedIngredient);
    }
    catch (error) {
        next(error);
    }
}
async function deleteExistingIngredient(req, res, next) {
    const ingredientId = req.params.ingredientId;
    try {
        const deletedIngredient = await (0, ingredientQueries_1.deleteIngredient)(ingredientId);
        if (!deletedIngredient) {
            res.status(404).json({ error: 'Ingredient not found' });
            return;
        }
        res.json(deletedIngredient);
    }
    catch (error) {
        next(error);
    }
}
