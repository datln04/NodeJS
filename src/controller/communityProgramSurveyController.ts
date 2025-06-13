import { Request, Response } from 'express';
import { sql, poolPromise } from '../config/db';

// GET ALL CommunityProgramSurvey as DTO, grouped by ProgramID
export async function getAll(req: Request, res: Response): Promise<void> {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT 
                cp.ProgramID, cp.ProgramName AS Name, cp.Description AS ProgramDescription,
                s.SurveyID, s.Description AS SurveyTitle, s.Description AS SurveyDescription
            FROM CommunityProgramSurvey cps
            JOIN CommunityProgram cp ON cps.ProgramID = cp.ProgramID
            JOIN Survey s ON cps.SurveyID = s.SurveyID
        `);

        // Group by ProgramID and build DTO
        // tạo 1 cái object để nhóm các survey theo ProgramID -- Map<Integer, Ojbect> -- key : value
        const grouped: Record<number, any> = {};
        // [{programid, name, progdes, sur, ....},{},...]
        // [{1},{2}]
        // 1 - [1,2,3]
        // Map<programId, [survey1, survey2, survey3]>
        //recordset return 
        result.recordset.forEach((row: any) => {
            // check map<key=1> if not exist, create new
            if (!grouped[row.ProgramID]) {
                // map.setkey(1, {1,progName, progDes, surveys: []})

                grouped[row.ProgramID] = {
                    ProgramID: row.ProgramID,
                    Name: row.Name,
                    Description: row.ProgramDescription,
                    surveys: []
                };
            }
            // const a = map.getKey(1) = {1,progName, progDes, surveys: []}

            // a.getSurveys.add({id, title, desc})
            grouped[row.ProgramID].surveys.push({
                SurveyID: row.SurveyID, // SurveyID = 3
                Title: row.SurveyTitle, // Title = "Survey 3"
                Description: row.SurveyDescription // Description = "Description of Survey 3"
            });
        });

        // Return as array of DTOs
        res.json(Object.values(grouped));
    } catch (err) {
        console.error("Error fetching CommunityProgramSurvey:", err);
        res.status(500).json({ message: "Server error" });
    }
}

// CREATE CommunityProgramSurvey
export async function create(req: Request, res: Response): Promise<void> {
    const { ProgramID, SurveyID } = req.body;
    if (!ProgramID || !SurveyID) {
        res.status(400).json({ message: "ProgramID and SurveyID are required" });
        return;
    }
    try {
        const pool = await poolPromise;

        // Validate Program exists
        const programResult = await pool.request()
            .input('ProgramID', sql.Int, ProgramID)
            .query(`SELECT * FROM CommunityProgram WHERE ProgramID = @ProgramID`);
        if (programResult.recordset.length === 0) {
            res.status(404).json({ message: "Community Program not found" });
            return;
        }

        // Validate Survey exists
        const surveyResult = await pool.request()
            .input('SurveyID', sql.Int, SurveyID)
            .query(`SELECT * FROM Survey WHERE SurveyID = @SurveyID`);
        if (surveyResult.recordset.length === 0) {
            res.status(404).json({ message: "Survey not found" });
            return;
        }

        // Prevent duplicate
        const existsResult = await pool.request()
            .input('ProgramID', sql.Int, ProgramID)
            .input('SurveyID', sql.Int, SurveyID)
            .query(`SELECT * FROM CommunityProgramSurvey WHERE ProgramID = @ProgramID AND SurveyID = @SurveyID`);
        if (existsResult.recordset.length > 0) {
            res.status(409).json({ message: "Survey already linked to this program" });
            return;
        }

        // Insert
        await pool.request()
            .input('ProgramID', sql.Int, ProgramID)
            .input('SurveyID', sql.Int, SurveyID)
            .query(`
                INSERT INTO CommunityProgramSurvey (ProgramID, SurveyID)
                VALUES (@ProgramID, @SurveyID)
            `);

        res.status(201).json({ ProgramID, SurveyID });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

// DELETE CommunityProgramSurvey
export async function remove(req: Request, res: Response): Promise<void> {
    const programId = Number(req.params.programId);
    const surveyId = Number(req.params.surveyId);
    if (!programId || !surveyId) {
        res.status(400).json({ message: "ProgramID and SurveyID are required" });
        return;
    }
    try {
        const pool = await poolPromise;
        const deleteResult = await pool.request()
            .input('ProgramID', sql.Int, programId)
            .input('SurveyID', sql.Int, surveyId)
            .query(`
                DELETE FROM CommunityProgramSurvey
                WHERE ProgramID = @ProgramID AND SurveyID = @SurveyID
            `);
        if (deleteResult.rowsAffected[0] === 0) {
            res.status(404).json({ message: "Link not found" });
            return;
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}