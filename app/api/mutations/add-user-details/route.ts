import { UserDetails } from "@/app/types/user";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const req = await request.json();
        if (!req) {
            return NextResponse.json({ error: 'Required field not provided' }, { status: 500 });
        }
        const { emailAddress, categoryId, firstName, lastName, country, isAdult, categoryIdPreference } = <UserDetails>req;
        if (!emailAddress) {
            return NextResponse.json({ error: 'No email address provided' }, { status: 500 });
        }

        const values = [emailAddress, categoryId, firstName, lastName, country, isAdult, categoryIdPreference];
        await sql.query(`
            INSERT INTO user_details (email_address, first_name, last_name, country, is_adult)
            VALUES ($1, $2, $3, $4, $5, $6) 
            ON CONFLICT (email_address) DO UPDATE SET 
                first_name = EXCLUDED.first_name, 
                last_name = EXCLUDED.last_name,
                country = EXCLUDED.country,
                is_adult = EXCLUDED.is_adult,
                category_id_preference = EXCLUDED.category_id_preference;
        `, values)

    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: 'User details added successfully', success: true }, { status: 200 });
}