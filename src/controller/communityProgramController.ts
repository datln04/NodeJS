import { Request, Response } from 'express';
import { sql, poolPromise } from '../config/db';

// GET ALL CommunityPrograms
export async function getAll(req: Request, res: Response): Promise<void> {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT * FROM CommunityProgram
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

// GET CommunityProgram by ID
export async function getById(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT * FROM CommunityProgram WHERE ProgramID = @id
            `);
        const program = result.recordset[0];
        if (!program) {
            res.status(404).json({ message: "Community Program not found" });
            return;
        }
        res.json(program);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

// CREATE CommunityProgram
export async function create(req: Request, res: Response): Promise<void> {
    const { ProgramName, Type, Date, Description, Organizer, Location, Url, ImageUrl, IsDisabled } = req.body;
    try {
        const pool = await poolPromise;
        const insertResult = await pool.request()
            .input('ProgramName', sql.NVarChar, ProgramName)
            .input('Type', sql.NVarChar, Type || null)
            .input('Date', sql.DateTime, Date)
            .input('Description', sql.NVarChar, Description || null)
            .input('Organizer', sql.NVarChar, Organizer || null)
            .input('Location', sql.NVarChar, Location || null)
            .input('Url', sql.NVarChar, Url || null)
            .input('ImageUrl', sql.NVarChar, ImageUrl || null)
            .input('IsDisabled', sql.Bit, IsDisabled)
            .query(`
                INSERT INTO CommunityProgram 
                (ProgramName, Type, Date, Description, Organizer, Location, Url, ImageUrl, IsDisabled)
                OUTPUT INSERTED.ProgramID
                VALUES (@ProgramName, @Type, @Date, @Description, @Organizer, @Location, @Url, @ImageUrl, @IsDisabled)
            `);
        const newId = insertResult.recordset[0].ProgramID;
        const result = await pool.request()
            .input('id', sql.Int, newId)
            .query(`SELECT * FROM CommunityProgram WHERE ProgramID = @id`);
        res.status(201).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

// UPDATE CommunityProgram
export async function update(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const { ProgramName, Type, Date, Description, Organizer, Location, Url, ImageUrl, IsDisabled } = req.body;
    try {
        const pool = await poolPromise;
        const updateResult = await pool.request()
            .input('id', sql.Int, id)
            .input('ProgramName', sql.NVarChar, ProgramName)
            .input('Type', sql.NVarChar, Type || null)
            .input('Date', sql.DateTime, Date)
            .input('Description', sql.NVarChar, Description || null)
            .input('Organizer', sql.NVarChar, Organizer || null)
            .input('Location', sql.NVarChar, Location || null)
            .input('Url', sql.NVarChar, Url || null)
            .input('ImageUrl', sql.NVarChar, ImageUrl || null)
            .input('IsDisabled', sql.Bit, IsDisabled)
            .query(`
                UPDATE CommunityProgram
                SET ProgramName = @ProgramName,
                    Type = @Type,
                    Date = @Date,
                    Description = @Description,
                    Organizer = @Organizer,
                    Location = @Location,
                    Url = @Url,
                    ImageUrl = @ImageUrl,
                    IsDisabled = @IsDisabled
                WHERE ProgramID = @id
            `);
        if (updateResult.rowsAffected[0] === 0) {
            res.status(404).json({ message: "Community Program not found" });
            return;
        }
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`SELECT * FROM CommunityProgram WHERE ProgramID = @id`);
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

// DELETE CommunityProgram
export async function remove(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    try {
        const pool = await poolPromise;
        const deleteResult = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM CommunityProgram WHERE ProgramID = @id');
        if (deleteResult.rowsAffected[0] === 0) {
            res.status(404).json({ message: "Community Program not found" });
            return;
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}