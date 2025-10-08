// Get addresses from MySQL database
import db from "../data/db";

export interface TownRow {
    cPostalCode: string;
    cTownName: string;
}

export async function getRandomTown(): Promise<TownRow> {
    // Gets any random town from the towns table
    try {
        const [rows] = await db.query("SELECT cPostalCode, cTownName FROM postal_code ORDER BY RAND() LIMIT 1");
        const town = (rows as TownRow[])[0];
        return town;
    } catch (error) {
        console.error("Error fetching town from database:", error);
        throw error;
    }
}

