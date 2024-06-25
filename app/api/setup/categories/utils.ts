import { IApiResponse } from "@/app/types/api";
import { ICategory } from "@/app/types/podcast";
import { sql } from "@vercel/postgres";

const categoryAPIUrl = () =>
    `https://api.spreaker.com/v2/show-categories`;

export class Utils {
    static async getCategoryDataFromAPI(): Promise<IApiResponse | null> {
        const res = await fetch(categoryAPIUrl());
        if (!res.ok) {
            return null;
        }
        const data: IApiResponse = await res.json();
        return data;
    }

    static async createCategoryTable(): Promise<boolean> {
        const result =
            await sql.query(`
                CREATE TABLE IF NOT EXISTS category ( id SERIAL PRIMARY KEY, category_id INT UNIQUE, name VARCHAR(255) );
            `);
        return !!result;
    }

    static async upsertCategories(categoryList: ICategory[]): Promise<boolean> {
        const values = [];
        const valuesQuery = [];
        let i = 1;
        for (const category of categoryList) {
            values.push(...[category.category_id, category.name]);
            valuesQuery.push(`($${i++}, $${i++})`);
        }
        const valuesStr = `${valuesQuery.join(', ')}`;
        const query = `INSERT INTO category (category_id, name) VALUES ${valuesStr} ON CONFLICT (category_id) DO NOTHING;`;
        const result = await sql.query(query, values);
        return !!result;
    }
}