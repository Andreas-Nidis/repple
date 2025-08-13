import { Request, Response, NextFunction } from 'express';
import * as weightService from '../services/weightService';

export async function getAllWeightEntries(req: Request, res: Response, next: NextFunction) {
    try {
        const entries = await weightService.listWeightEntries(req.user?.id!);
        res.status(200).json(entries);
    } catch (error) {
        next(error);
    }
}

export async function createWeightEntry(req: Request, res: Response, next: NextFunction) {
    try {
        const newEntry = await weightService.addWeightEntry(
            req.user?.id!,
            req.body.entryDate,
            req.body.weight
        );
        res.status(201).json(newEntry);
    } catch (error) {
        next(error);
    }
}

export async function updateWeightEntry(req: Request, res: Response, next: NextFunction) {
    try {
        const updatedEntry = await weightService.modifyWeightEntry(
            req.user?.id!,
            req.params.entryDate,
            req.body.weight
        );
        res.status(200).json(updatedEntry);
    } catch (error) {
        next(error);
    }
}

export async function deleteWeightEntry(req: Request, res: Response, next: NextFunction) {
    try {
        const deletedEntry = await weightService.removeWeightEntry(req.user?.id!, req.params.entryDate);
        res.status(200).json(deletedEntry);
    } catch (error) {
        next(error);
    }
}
