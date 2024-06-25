import { ICategoryShowDuration } from "@/app/types/podcast";
import { sql } from "@vercel/postgres";

export class Util {
    static async getCategoryShowDuration(): Promise<ICategoryShowDuration[]> {
        const result = await sql.query<ICategoryShowDuration>(`
            SELECT ca.category_id, ca.name, SUM(ep.duration) AS total_duration 
            FROM shows sh INNER JOIN category ca ON sh.category_id = ca.category_id
            INNER JOIN episodes ep ON ep.show_id = sh.show_id
            GROUP BY ca.category_id, ca.name
            ORDER BY ca.name
        `);
        return result?.rowCount > 0 ? result.rows : []
    }
}