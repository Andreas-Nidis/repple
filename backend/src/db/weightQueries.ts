import { sql } from './db';

export async function getWeightEntries(userId: string) {
    return await sql.query(`
        SELECT to_char(entry_date, 'YYYY-MM-DD') AS entry_date, weight FROM weight_logs 
        WHERE user_id = $1
        ORDER BY entry_date ASC
    `, [userId]);
}

export async function createWeightEntry(userId: string, entryDate: string, weight: number) {
    await sql.query(`
        INSERT INTO weight_logs (user_id, entry_date, weight)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, entry_date)
        DO UPDATE SET weight = EXCLUDED.weight
    `, [userId, entryDate, weight]);
};

export async function updateWeightEntry(userId: string, entryDate: string, weight: number) {
    await sql.query(`
        UPDATE weight_logs 
        SET weight = $3
        WHERE user_id = $1 AND entry_date = $2
    `, [userId, entryDate, weight]);
};

export async function deleteWeightEntries(userId: string, entryDate: string) {
    await sql.query(`
        DELETE FROM weight_logs WHERE user_id = $1 AND entry_date = $2
    `, [userId, entryDate]);
}