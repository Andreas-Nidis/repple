"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeals = getMeals;
exports.getMeal = getMeal;
exports.createMealHandler = createMealHandler;
exports.updateMealHandler = updateMealHandler;
exports.deleteMealHandler = deleteMealHandler;
const mealQueries_1 = require("../db/mealQueries");
async function getMeals(req, res, next) {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const meals = await (0, mealQueries_1.getMealsByUser)(userId);
        res.json(meals);
    }
    catch (error) {
        next(error);
    }
}
async function getMeal(req, res, next) {
    const userId = req.user?.id;
    const mealId = req.params.mealId;
    if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const meal = await (0, mealQueries_1.getMealById)(userId, mealId);
        if (!meal) {
            res.status(404).json({ error: 'Meal not found' });
            return;
        }
        res.json(meal);
    }
    catch (error) {
        next(error);
    }
}
async function createMealHandler(req, res, next) {
    const userId = req.user?.id;
    const { name } = req.body;
    if (!userId || !name) {
        res.status(400).json({ error: 'Name is required or unauthorized' });
        return;
    }
    try {
        const newMeal = await (0, mealQueries_1.createMeal)(userId, name);
        res.status(201).json(newMeal);
    }
    catch (error) {
        next(error);
    }
}
async function updateMealHandler(req, res, next) {
    const userId = req.user?.id;
    const mealId = req.params.mealId;
    const { total_protein, total_carbs, total_fat, selected } = req.body;
    if (!userId) {
        res.status(400).json({ error: 'Unauthorized' });
        return;
    }
    try {
        const updatedMeal = await (0, mealQueries_1.updateMeal)(userId, mealId, total_protein, total_carbs, total_fat, selected);
        if (!updatedMeal || updatedMeal.user_id !== userId) {
            res.status(404).json({ error: 'Meal not found' });
            return;
        }
        res.json(updatedMeal);
    }
    catch (error) {
        next(error);
    }
}
async function deleteMealHandler(req, res, next) {
    const userId = req.user?.id;
    const mealId = req.params.mealId;
    if (!userId || !mealId) {
        res.status(400).json({ error: 'Invalid meal ID or unauthorized' });
        return;
    }
    try {
        const deletedMeal = await (0, mealQueries_1.deleteMeal)(userId, mealId);
        if (!deletedMeal || deletedMeal.user_id !== userId) {
            res.status(404).json({ error: 'Meal not found' });
            return;
        }
        res.json(deletedMeal);
    }
    catch (error) {
        next(error);
    }
}
