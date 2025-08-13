// tests/services/workoutExerciseService.test.ts
import * as workoutExerciseService from '../../src/services/workoutExerciseService';
import * as workoutExerciseDb from '../../src/db/workoutExerciseQueries';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('../../src/db/workoutExerciseQueries');

describe('workoutExerciseService', () => {
    const userId = 'user-123';
    const workoutId = 'workout-456';
    const exerciseId = 'exercise-789';
    const mockExercise = { workout_id: workoutId, exercise_id: exerciseId, user_id: userId, name: 'Test Exercise', sets: 3, reps: 3, restSeconds: 90 };

    let mockGetExercisesInWorkout: jest.MockedFunction<typeof workoutExerciseDb.getExercisesInWorkout>;
    let mockGetExerciseInWorkout: jest.MockedFunction<typeof workoutExerciseDb.getExerciseInWorkout>;
    let mockAddExerciseToWorkout: jest.MockedFunction<typeof workoutExerciseDb.addExerciseToWorkout>;
    let mockUpdateExerciseInWorkout: jest.MockedFunction<typeof workoutExerciseDb.updateExerciseInWorkout>;
    let mockRemoveExerciseFromWorkout: jest.MockedFunction<typeof workoutExerciseDb.removeExerciseFromWorkout>;

    beforeEach(() => {
        mockGetExercisesInWorkout = workoutExerciseDb.getExercisesInWorkout as jest.MockedFunction<typeof workoutExerciseDb.getExercisesInWorkout>;
        mockGetExerciseInWorkout = workoutExerciseDb.getExerciseInWorkout as jest.MockedFunction<typeof workoutExerciseDb.getExerciseInWorkout>;
        mockAddExerciseToWorkout = workoutExerciseDb.addExerciseToWorkout as jest.MockedFunction<typeof workoutExerciseDb.addExerciseToWorkout>;
        mockUpdateExerciseInWorkout = workoutExerciseDb.updateExerciseInWorkout as jest.MockedFunction<typeof workoutExerciseDb.updateExerciseInWorkout>;
        mockRemoveExerciseFromWorkout = workoutExerciseDb.removeExerciseFromWorkout as jest.MockedFunction<typeof workoutExerciseDb.removeExerciseFromWorkout>;

        jest.resetAllMocks();
    });

    describe('listExercises', () => {
        it('should throw Unauthorized if no userId', async () => {
            await expect(workoutExerciseService.listExercises('', workoutId)).rejects.toThrow('Unauthorized');
        });

        it('should return exercises from DB', async () => {
            mockGetExercisesInWorkout.mockResolvedValue([mockExercise]);

            const result = await workoutExerciseService.listExercises(userId, workoutId);

            expect(workoutExerciseDb.getExercisesInWorkout).toHaveBeenCalledWith(workoutId);
            expect(result).toEqual([mockExercise]);
        });
    });

    describe('getSingleExercise', () => {
        it('should throw Unauthorized if no userId', async () => {
            await expect(workoutExerciseService.getSingleExercise('', workoutId, exerciseId)).rejects.toThrow('Unauthorized');
        });

        it('should throw NotFound if exercise does not exist', async () => {
            mockGetExerciseInWorkout.mockResolvedValue([]);
            await expect(workoutExerciseService.getSingleExercise(userId, workoutId, exerciseId)).rejects.toThrow('NotFound');
        });

        it('should throw NotFound if workout belongs to another user', async () => {
            mockGetExerciseInWorkout.mockResolvedValue([
                {
                    id: 'exercise-789', 
                    user_id: 'different-user', 
                    name: 'Test Exercise', 
                    sets: 3,
                    reps: 3,
                    restSeconds: 90
                }
            ]);

            await expect(workoutExerciseService.getSingleExercise(userId, workoutId, exerciseId)).rejects.toThrow('NotFound');
        });

        it('should return exercise if valid', async () => {
            mockGetExerciseInWorkout.mockResolvedValue(mockExercise);

            const result = await workoutExerciseService.getSingleExercise(userId, workoutId, exerciseId);

            expect(result).toEqual(mockExercise);
        });
    });

    describe('addNewExercise', () => {
        it('should throw Unauthorized if no userId', async () => {
            await expect(workoutExerciseService.addNewExercise(
                '',
                workoutId, 
                exerciseId, 
                3,
                3,
                90
            )).rejects.toThrow('Unauthorized');
        });

        it('should throw BadRequest if no exerciseId, sets, or reps', async () => {
            await expect(workoutExerciseService.addNewExercise(
                userId,
                workoutId, 
                '', 
                3,
                3,
                90
            )).rejects.toThrow('BadRequest');

            await expect(workoutExerciseService.addNewExercise(
                userId,
                workoutId, 
                exerciseId, 
                0,
                3,
                90
            )).rejects.toThrow('BadRequest');

            await expect(workoutExerciseService.addNewExercise(
                userId,
                workoutId, 
                exerciseId, 
                3,
                0,
                90
            )).rejects.toThrow('BadRequest');
        });

        it('should call DB and return exercise when added to workout', async () => {
            mockAddExerciseToWorkout.mockResolvedValue(mockExercise);

            const result = await workoutExerciseService.addNewExercise(
                userId,
                workoutId, 
                exerciseId, 
                3,
                3,
                90
            );

            expect(workoutExerciseDb.addExerciseToWorkout).toHaveBeenCalledWith(
                workoutId, 
                exerciseId, 
                3,
                3,
                90
            );
            expect(result).toEqual(mockExercise);
        });
    });

    describe('updateExerciseDetails', () => {
        it('should throw Unauthorized if no userId', async () => {
            await expect(workoutExerciseService.updateExerciseDetails(
                '',
                workoutId,
                exerciseId,
                4,
                10,
                120
            )).rejects.toThrow('Unauthorized');
        });

        it('should throw BadRequest if sets or reps are invalid', async () => {
            await expect(workoutExerciseService.updateExerciseDetails(
                userId,
                workoutId,
                exerciseId,
                0,
                10,
                120
            )).rejects.toThrow('BadRequest');

            await expect(workoutExerciseService.updateExerciseDetails(
                userId,
                workoutId,
                exerciseId,
                4,
                0,
                120
            )).rejects.toThrow('BadRequest');
        });

        it('should throw NotFound if exercise is not found or belongs to another user', async () => {
            mockGetExerciseInWorkout.mockResolvedValue([]);

            await expect(workoutExerciseService.updateExerciseDetails(
                userId,
                workoutId,
                exerciseId,
                4,
                10,
                120
            )).rejects.toThrow('NotFound');

            mockGetExerciseInWorkout.mockResolvedValue({ ...mockExercise, user_id: 'different-user' });

            await expect(workoutExerciseService.updateExerciseDetails(
                userId,
                workoutId,
                exerciseId,
                4,
                10,
                120
            )).rejects.toThrow('NotFound');
        });

        it('should update exercise details and return updated exercise', async () => {
            const updatedExercise = { ...mockExercise, sets: 4, reps: 10, restSeconds: 120 };
            mockGetExerciseInWorkout.mockResolvedValue(mockExercise);
            mockUpdateExerciseInWorkout.mockResolvedValue(updatedExercise);

            const result = await workoutExerciseService.updateExerciseDetails(
                userId,
                workoutId,
                exerciseId,
                4,
                10,
                120
            );

            expect(workoutExerciseDb.updateExerciseInWorkout).toHaveBeenCalledWith(
                workoutId,
                exerciseId,
                4,
                10,
                120
            );
            expect(result).toEqual(updatedExercise);
        });
    });

    describe('removeExerciseById', () => {
        it('should throw Unauthorized if no userId', async () => {
            await expect(workoutExerciseService.removeExerciseById(
                '',
                workoutId,
                exerciseId
            )).rejects.toThrow('Unauthorized');
        });

        it('should throw NotFound if exercise does not exist or belongs to another user', async () => {
            mockGetExerciseInWorkout.mockResolvedValue([]);

            await expect(workoutExerciseService.removeExerciseById(
                userId,
                workoutId,
                exerciseId
            )).rejects.toThrow('NotFound');

            mockGetExerciseInWorkout.mockResolvedValue({ ...mockExercise, user_id: 'different-user' });

            await expect(workoutExerciseService.removeExerciseById(
                userId,
                workoutId,
                exerciseId
            )).rejects.toThrow('NotFound');
        });

        it('should remove exercise from workout and return result', async () => {
            mockGetExerciseInWorkout.mockResolvedValue(mockExercise);
            mockRemoveExerciseFromWorkout.mockResolvedValue({ success: true });

            const result = await workoutExerciseService.removeExerciseById(
                userId,
                workoutId,
                exerciseId
            );

            expect(workoutExerciseDb.removeExerciseFromWorkout).toHaveBeenCalledWith(
                workoutId,
                exerciseId
            );
            expect(result).toEqual({ success: true });
        });
    });

})