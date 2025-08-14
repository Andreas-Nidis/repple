import { sql } from './db'

export async function getEntriesForWeek(userId: string, startDate:string, endDate: string) {
    const result = await sql.query(
        `SELECT * FROM calendar_entries
        WHERE user_id = $1 AND scheduled_date BETWEEN $2 AND $3
        ORDER BY scheduled_date`, [userId, startDate, endDate]
    );
    return result;
}

export async function createCalendarEntry(userId: string, workoutId: string, scheduledDate: string): Promise<Record<string, any> | undefined> {
    const result = await sql.query(
        `INSERT INTO calendar_entries (user_id, workout_id, scheduled_date)
        VALUES ($1, $2, $3)
        RETURNING *`, [userId, workoutId, scheduledDate]
    );
    return result;
}

export async function toggleCompletion(userId: string, scheduledDate: string): Promise<Record<string, any> | undefined> {
    const result = await sql.query(
        `UPDATE calendar_entries
        SET is_completed = NOT is_completed
        WHERE user_id = $1 AND scheduled_date = $2
        RETURNING *`, [userId, scheduledDate]
    );
    return result;
}

export async function deleteCalendarEntry(userId: string, id: string): Promise<Record<string, any> | undefined> {
    const result = await sql.query(
        `DELETE FROM calendar_entries
        WHERE user_id = $1 AND id = $2
        RETURNING *`, [userId, id]
    );
    return result;
}