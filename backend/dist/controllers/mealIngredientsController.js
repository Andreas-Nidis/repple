"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMealIngredients = getMealIngredients;
exports.addIngredient = addIngredient;
exports.updateIngredient = updateIngredient;
exports.removeIngredient = removeIngredient;
const mealIngredientsQueries_1 = require("../db/mealIngredientsQueries");
async function getMealIngredients(req, res, next) {
    const userId = req.user?.id;
    const mealId = req.params.mealId;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    if (!mealId) {
        res.status(400).json({ error: 'Meal ID is required' });
        return;
    }
    try {
        const mealIngredients = await (0, mealIngredientsQueries_1.getIngredientsInMeal)(userId, mealId);
        res.json(mealIngredients);
    }
    catch (error) {
        next(error);
    }
}
async function addIngredient(req, res, next) {
    const userId = req.user?.id;
    const mealId = req.params.mealId;
    const ingredientId = req.params.ingredientId;
    const { quantity } = req.body;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    if (!mealId || !ingredientId) {
        res.status(400).json({ error: 'Meal ID and Ingredient ID are required' });
        return;
    }
    try {
        const result = await (0, mealIngredientsQueries_1.addIngredientToMeal)(userId, mealId, ingredientId, quantity);
        res.status(201).json({ message: 'Ingredient added to meal successfully', result });
    }
    catch (error) {
        next(error);
    }
}
async function updateIngredient(req, res, next) {
    const userId = req.user?.id;
    const mealId = req.params.mealId;
    const ingredientId = req.params.ingredientId;
    const { quantity } = req.body;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    if (!mealId || !ingredientId) {
        res.status(400).json({ error: 'Meal ID and Ingredient ID are required' });
        return;
    }
    try {
        const result = await (0, mealIngredientsQueries_1.updateIngredientInMeal)(userId, mealId, ingredientId, quantity);
        res.status(200).json({ message: 'Ingredient updated in meal successfully', result });
    }
    catch (error) {
        next(error);
    }
}
async function removeIngredient(req, res, next) {
    const userId = req.user?.id;
    const mealId = req.params.mealId;
    const ingredientId = req.params.ingredientId;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    if (!mealId || !ingredientId) {
        res.status(400).json({ error: 'Meal ID and Ingredient ID are required' });
        return;
    }
    try {
        await (0, mealIngredientsQueries_1.removeIngredientFromMeal)(userId, mealId, ingredientId);
        res.status(200).json({ message: 'Ingredient removed from meal successfully' });
    }
    catch (error) {
        next(error);
    }
}
