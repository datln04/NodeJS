import { Request, Response } from 'express';
import { sql, poolPromise } from '../config/db';

// GET ALL CommunityProgramAttendees
export async function getAll(req: Request, res: Response): Promise<void> {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT * FROM CommunityProgramAttendee
        `);
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

export async function getTotalByProgramId(req: Request, res: Response): Promise<void> {
    const programId = Number(req.params.programId);
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ProgramID', sql.Int, programId)
            .query(`
                SELECT COUNT(*) AS total
                FROM CommunityProgramAttendee
                WHERE ProgramID = @ProgramID
            `);
        res.json({ total: result.recordset[0].total });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

// GET CommunityProgramAttendee by ProgramID & AccountID
export async function getById(req: Request, res: Response): Promise<void> {
    const programId = Number(req.params.programId);
    const accountId = Number(req.params.accountId);
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ProgramID', sql.Int, programId)
            .input('AccountID', sql.Int, accountId)
            .query(`
                SELECT * FROM CommunityProgramAttendee
                WHERE ProgramID = @ProgramID AND AccountID = @AccountID
            `);
        const attendee = result.recordset[0];
        if (!attendee) {
            res.status(404).json({ message: "Attendee not found" });
            return;
        }
        res.json(attendee);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

// CREATE CommunityProgramAttendee
export async function create(req: Request, res: Response): Promise<void> {
    const { ProgramID, AccountID, RegistrationDate, Status } = req.body;
    try {
        const pool = await poolPromise;

        // Check if Account is Guest
        const accountResult = await pool.request()
            .input('AccountID', sql.Int, AccountID)
            .query(`SELECT Role FROM Account WHERE AccountID = @AccountID`);
        const account = accountResult.recordset[0];
        if (!account) {
            res.status(400).json({ message: "Account not found" });
            return;
        }
        if (account.Role === 'Guest') {
            res.status(403).json({ message: "Guests cannot register for community programs" });
            return;
        }

        // Check if Program exists
        const programResult = await pool.request()
            .input('ProgramID', sql.Int, ProgramID)
            .query(`SELECT * FROM CommunityProgram WHERE ProgramID = @ProgramID`);
        if (programResult.recordset.length === 0) {
            res.status(404).json({ message: "Community Program not found" });
            return;
        }

        // Only allow registration if Status is 'True'
        if (Status !== 'True') {
            res.status(400).json({ message: "Status must be 'True' to register" });
            return;
        }

        // Insert attendee
        await pool.request()
            .input('ProgramID', sql.Int, ProgramID)
            .input('AccountID', sql.Int, AccountID)
            .input('RegistrationDate', sql.DateTime, RegistrationDate)
            .input('Status', sql.NVarChar, Status)
            .query(`
                INSERT INTO CommunityProgramAttendee (ProgramID, AccountID, RegistrationDate, Status)
                VALUES (@ProgramID, @AccountID, @RegistrationDate, @Status)
            `);

        // Return the created attendee
        const result = await pool.request()
            .input('ProgramID', sql.Int, ProgramID)
            .input('AccountID', sql.Int, AccountID)
            .query(`
                SELECT * FROM CommunityProgramAttendee
                WHERE ProgramID = @ProgramID AND AccountID = @AccountID
            `);
        res.status(201).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

// UPDATE CommunityProgramAttendee
export async function update(req: Request, res: Response): Promise<void> {
    const programId = Number(req.params.programId);
    const accountId = Number(req.params.accountId);
    const { RegistrationDate, Status } = req.body;
    try {
        const pool = await poolPromise;

        // Only allow update if Status is 'True'
        if (Status !== 'True') {
            res.status(400).json({ message: "Status must be 'True' to update" });
            return;
        }

        const updateResult = await pool.request()
            .input('ProgramID', sql.Int, programId)
            .input('AccountID', sql.Int, accountId)
            .input('RegistrationDate', sql.DateTime, RegistrationDate)
            .input('Status', sql.NVarChar, Status)
            .query(`
                UPDATE CommunityProgramAttendee
                SET RegistrationDate = @RegistrationDate, Status = @Status
                WHERE ProgramID = @ProgramID AND AccountID = @AccountID
            `);
        if (updateResult.rowsAffected[0] === 0) {
            res.status(404).json({ message: "Attendee not found" });
            return;
        }
        const result = await pool.request()
            .input('ProgramID', sql.Int, programId)
            .input('AccountID', sql.Int, accountId)
            .query(`
                SELECT * FROM CommunityProgramAttendee
                WHERE ProgramID = @ProgramID AND AccountID = @AccountID
            `);
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

// DELETE CommunityProgramAttendee
export async function remove(req: Request, res: Response): Promise<void> {
    const programId = Number(req.params.programId);
    const accountId = Number(req.params.accountId);
    try {
        const pool = await poolPromise;
        const deleteResult = await pool.request()
            .input('ProgramID', sql.Int, programId)
            .input('AccountID', sql.Int, accountId)
            .query(`
                DELETE FROM CommunityProgramAttendee
                WHERE ProgramID = @ProgramID AND AccountID = @AccountID
            `);
        if (deleteResult.rowsAffected[0] === 0) {
            res.status(404).json({ message: "Attendee not found" });
            return;
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}