import { IUserDetails } from "@/app/types/user";
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {
        const req = await request.json();
        if (!req) {
            return NextResponse.json({ error: 'Required field not provided' }, { status: 500 });
        }
        const { emailAddress, firstName, lastName, country } = <IUserDetails>req;
        if (!emailAddress) {
            return NextResponse.json({ error: 'No email address provided' }, { status: 500 });
        }

        const values = [emailAddress, firstName, lastName, country];
        await sql.query(`
            INSERT INTO user_details (email_address, first_name, last_name, country)
            VALUES ($1, $2, $3, $4) 
            ON CONFLICT (email_address) DO UPDATE SET 
                first_name = EXCLUDED.first_name, 
                last_name = EXCLUDED.last_name,
                country = EXCLUDED.country;
        `, values)

    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ message: 'User details added successfully', success: true }, { status: 200 });
}