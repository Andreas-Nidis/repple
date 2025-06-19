import { sql } from './db';

export async function getWeightEntries(userId: string) {
    return await sql.query(`
        SELECT week_start, weight FROM weekly_weight_logs 
        WHERE user_id = $1
        ORDER BY week_start ASC
    `, [userId]);
}

export async function createWeightEntry(userId: string, weekStart: string, weight: number) {
    await sql.query(`
        INSERT INTO weekly_weight_logs (user_id, week_start, weight)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, week_start)
        DO UPDATE SET weight = EXCLUDED.weight
    `, [userId, weekStart, weight]);
};

export async function updateWeightEntry(userId: string, weekStart: string, weight: number) {
    await sql.query(`
        UPDATE weekly_weight_logs 
        SET weight = $3
        WHERE user_id = $1 AND week_start = $2
    `, [userId, weekStart, weight]);
};

export async function deleteWeightEntries(userId: string, weekStart: string) {
    await sql.query(`
        DELETE FROM weekly_weight_logs WHERE user_id = $1 AND week_start = $2
    `, [userId, weekStart]);
}