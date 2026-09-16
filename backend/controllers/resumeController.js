const db = require("../config/db");

const saveResume = (req, res) => {
    const {
        user_id,
        full_name,
        title,
        email,
        phone,
        address,
        summary,
        education,
        experience,
        skills,
        projects,
        language
    } = req.body;

    if (!user_id) {
        return res.status(400).json({
            message: "User ID is required"
        });
    }

    const toJson = (value) => {
        if (value === null || value === undefined) {
            return "[]";
        }

        if (typeof value === "string") {
            return value;
        }

        return JSON.stringify(value);
    };

    const educationData = toJson(education);
    const experienceData = toJson(experience);
    const skillsData = toJson(skills);
    const projectsData = toJson(projects);

    const languageData = Array.isArray(language)
        ? language.join(", ")
        : language || "";

    const checkSql = `
        SELECT id
        FROM resumes
        WHERE user_id = ?
        ORDER BY id DESC
        LIMIT 1
    `;

    db.query(checkSql, [user_id], (err, rows) => {
        if (err) {
            console.error("Resume check error:", err);

            return res.status(500).json({
                message: "Failed to check existing resume"
            });
        }

        // UPDATE
        if (rows.length > 0) {
            const resumeId = rows[0].id;

            const updateSql = `
                UPDATE resumes
                SET
                    full_name = ?,
                    title = ?,
                    email = ?,
                    phone = ?,
                    address = ?,
                    summary = ?,
                    education = ?,
                    experience = ?,
                    skills = ?,
                    projects = ?,
                    language = ?
                WHERE id = ?
            `;

            const updateValues = [
                full_name,
                title,
                email,
                phone,
                address,
                summary,
                educationData,
                experienceData,
                skillsData,
                projectsData,
                languageData,
                resumeId
            ];

            db.query(updateSql, updateValues, (err) => {
                if (err) {
                    console.error("Resume update error:", err);

                    return res.status(500).json({
                        message: "Failed to update resume"
                    });
                }

                return res.status(200).json({
                    message: "Resume updated successfully",
                    resume_id: resumeId
                });
            });

        } else {
            // INSERT
            const insertSql = `
                INSERT INTO resumes
                (
                    user_id,
                    full_name,
                    title,
                    email,
                    phone,
                    address,
                    summary,
                    education,
                    experience,
                    skills,
                    projects,
                    language
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const insertValues = [
                user_id,
                full_name,
                title,
                email,
                phone,
                address,
                summary,
                educationData,
                experienceData,
                skillsData,
                projectsData,
                languageData
            ];

            db.query(insertSql, insertValues, (err, result) => {
                if (err) {
                    console.error("Resume insert error:", err);

                    return res.status(500).json({
                        message: "Failed to save resume"
                    });
                }

                return res.status(201).json({
                    message: "Resume saved successfully",
                    resume_id: result.insertId
                });
            });
        }
    });
};

// Load Resume
const loadResume = (req, res) => {
    const { user_id } = req.params;

    const sql = "SELECT * FROM resumes WHERE user_id = ? ORDER BY id DESC LIMIT 1";

    db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error("Resume load error:", err);
            return res.status(500).json({
                message: "Failed to load resume"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "No resume found"
            });
        }

        res.status(200).json(results[0]);
    });
};


module.exports = {
    saveResume,
    loadResume
};