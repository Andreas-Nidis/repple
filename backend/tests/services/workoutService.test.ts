// tests/services/workoutService.test.ts
import * as workoutService from '../../src/services/workoutService';
import * as workoutDb from '../../src/db/workoutQueries';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

jest.mock('../../src/db/workoutQueries');

describe('workoutService', () => {
    const userId = 'user-123';
    const workoutId = 'workout-456';
    const workout = { id: workoutId, user_id: userId, name: 'Test Workout', category: 'Strength' };

    let mockGetWorkoutsByUser: jest.MockedFunction<typeof workoutDb.getWorkoutsByUser>;
    let mockGetWorkoutById: jest.MockedFunction<typeof workoutDb.getWorkoutById>;
    let mockCreateWorkout: jest.MockedFunction<typeof workoutDb.createWorkout>;
    let mockUpdateWorkout: jest.MockedFunction<typeof workoutDb.updateWorkout>;
    let mockDeleteWorkout: jest.MockedFunction<typeof workoutDb.deleteWorkout>;

    beforeEach(() => {
        mockGetWorkoutsByUser = workoutDb.getWorkoutsByUser as jest.MockedFunction<typeof workoutDb.getWorkoutsByUser>;
        mockGetWorkoutById = workoutDb.getWorkoutById as jest.MockedFunction<typeof workoutDb.getWorkoutById>;
        mockCreateWorkout = workoutDb.createWorkout as jest.MockedFunction<typeof workoutDb.createWorkout>;
        mockUpdateWorkout = workoutDb.updateWorkout as jest.MockedFunction<typeof workoutDb.updateWorkout>;
        mockDeleteWorkout = workoutDb.deleteWorkout as jest.MockedFunction<typeof workoutDb.deleteWorkout>;

        jest.resetAllMocks();
    });

    describe('listWorkouts', () => {
        it('should throw Unauthorized if no userId', async () => {
            await expect(workoutService.listWorkouts('')).rejects.toThrow('Unauthorized');
        });

        it('should return workouts from DB', async () => {
            mockGetWorkoutsByUser.mockResolvedValue([workout]);

            const result = await workoutService.listWorkouts(userId);

            expect(workoutDb.getWorkoutsByUser).toHaveBeenCalledWith(userId);
            expect(result).toEqual([workout]);
        });
    });

    describe('getSingleWorkout', () => {
        it('should throw Unauthorized if no userId', async () => {
            await expect(workoutService.getSingleWorkout('', workoutId)).rejects.toThrow('Unauthorized');
        });

        it('should throw NotFound if workout does not exist', async () => {
            mockGetWorkoutById.mockResolvedValue([]);
            await expect(workoutService.getSingleWorkout(userId, workoutId)).rejects.toThrow('NotFound');
        });

        it('should throw NotFound if workout belongs to another user', async () => {
            mockGetWorkoutById.mockResolvedValue([
                {
                    id: 'workout-456', 
                    user_id: 'different-user', 
                    name: 'Test Workout', 
                    category: 'Strength' 
                }
            ]);

            await expect(workoutService.getSingleWorkout(userId, workoutId)).rejects.toThrow('NotFound');
        });

        it('should return workout if valid', async () => {
            mockGetWorkoutById.mockResolvedValue([workout]);

            const result = await workoutService.getSingleWorkout(userId, workoutId);

            expect(result).toEqual(workout);
        });
    });

    describe('createNewWorkout', () => {
        it('should throw Unauthorized if no userId', async () => {
            await expect(workoutService.createNewWorkout('', 'Test')).rejects.toThrow('Unauthorized');
        });

        it('should throw BadRequest if no name', async () => {
            await expect(workoutService.createNewWorkout(userId, '')).rejects.toThrow('BadRequest');
        });

        it('should call DB and return created workout', async () => {
            mockCreateWorkout.mockResolvedValue(workout);

            const result = await workoutService.createNewWorkout(userId, 'Test Workout', 'Strength');

            expect(workoutDb.createWorkout).toHaveBeenCalledWith(userId, 'Test Workout', 'Strength');
            expect(result).toEqual(workout);
        });
    });

    describe('updateWorkoutDetails', () => {
        it('should throw Unauthorized if no userId', async () => {
            await expect(workoutService.updateWorkoutDetails('', workoutId, 'New Name')).rejects.toThrow('Unauthorized');
        });

        it('should throw BadRequest if no name', async () => {
            await expect(workoutService.updateWorkoutDetails(userId, workoutId, '')).rejects.toThrow('BadRequest');
        });

        it('should throw NotFound if workout belongs to another user', async () => {
            mockUpdateWorkout.mockResolvedValue([
                {
                    id: 'workout-456', 
                    user_id: 'different-user', 
                    name: 'Test Workout', 
                    category: 'Strength' 
                }
            ]);

            await expect(workoutService.updateWorkoutDetails(userId, workoutId, 'New Name')).rejects.toThrow('NotFound');
        });

        it('should return updated workout if valid', async () => {
            mockUpdateWorkout.mockResolvedValue(workout);

            const result = await workoutService.updateWorkoutDetails(userId, workoutId, 'New Name');

            expect(result).toEqual(workout);
        });
    });

    describe('deleteWorkoutById', () => {
        it('should throw Unauthorized if no userId', async () => {
            await expect(workoutService.deleteWorkoutById('', workoutId)).rejects.toThrow('Unauthorized');
        });

        it('should throw NotFound if workout belongs to another user', async () => {
            mockDeleteWorkout.mockResolvedValue([
                {
                    id: 'workout-456', 
                    user_id: 'different-user', 
                    name: 'Test Workout', 
                    category: 'Strength' 
                }
            ]);

            await expect(workoutService.deleteWorkoutById(userId, workoutId)).rejects.toThrow('NotFound');
        });

        it('should return deleted workout if valid', async () => {
            mockDeleteWorkout.mockResolvedValue(workout);

            const result = await workoutService.deleteWorkoutById(userId, workoutId);

            expect(result).toEqual(workout);
        });
    });
});
