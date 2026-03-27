import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

class GoogleSheetsService {
    constructor() {
        this.auth = null;
        this.sheets = null;
        this.spreadsheetId = process.env.SPREADSHEET_ID;
        this.currentSheetName = 'Questions'; // Default sheet name
        this.initialize();
    }

    /**
     * Set the current sheet name for operations
     */
    setSheetName(sheetName) {
        this.currentSheetName = sheetName || 'Questions';
    }

    async initialize() {
        try {
            // Create auth client from service account
            this.auth = new google.auth.GoogleAuth({
                keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
                scopes: [
                    'https://www.googleapis.com/auth/spreadsheets',
                    'https://www.googleapis.com/auth/drive.file',
                ],
            });

            this.sheets = google.sheets({ version: 'v4', auth: this.auth });
            console.log('✅ Google Sheets API initialized');
        } catch (error) {
            console.error('❌ Failed to initialize Google Sheets API:', error.message);
            throw error;
        }
    }

    /**
     * Get all test sheets (tabs) from the spreadsheet
     * Returns sheets that contain question data
     */
    async getAllTests() {
        try {
            const response = await this.sheets.spreadsheets.get({
                spreadsheetId: this.spreadsheetId,
                fields: 'sheets(properties(sheetId,title,gridProperties))',
            });

            const sheets = response.data.sheets || [];

            // Filter out system sheets (RespondentDetails, FormMeta, Form Responses)
            const testSheets = sheets
                .filter(sheet => {
                    const title = sheet.properties.title;
                    return !title.includes('RespondentDetails') &&
                        !title.includes('FormMeta') &&
                        !title.includes('Form Responses');
                })
                .map(sheet => ({
                    sheetId: sheet.properties.sheetId,
                    title: sheet.properties.title,
                    rowCount: sheet.properties.gridProperties?.rowCount || 0,
                    columnCount: sheet.properties.gridProperties?.columnCount || 0,
                }));

            // Get question count for each test
            const testsWithCounts = await Promise.all(
                testSheets.map(async (test) => {
                    try {
                        const questionResponse = await this.sheets.spreadsheets.values.get({
                            spreadsheetId: this.spreadsheetId,
                            range: `${test.title}!A2:A1000`,
                        });
                        const questionCount = questionResponse.data.values?.filter(row => row[0]).length || 0;
                        return { ...test, questionCount };
                    } catch (error) {
                        return { ...test, questionCount: 0 };
                    }
                })
            );

            return testsWithCounts;
        } catch (error) {
            console.error('Error getting tests:', error);
            throw error;
        }
    }

    /**
     * Read all questions from Google Sheets with enhanced parsing
     * Supports: ImageUrl, Option1ImageUrl-Option5ImageUrl, ConstraintsJson, TimerSeconds
     */
    async getQuestions(sheetName = null) {
        try {
            const targetSheet = sheetName || this.currentSheetName;
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: `${targetSheet}!A1:Z1000`,
            });

            const rows = response.data.values;
            if (!rows || rows.length === 0) {
                return [];
            }

            const headers = rows[0];
            const questions = [];

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const rawData = {};

                headers.forEach((header, index) => {
                    rawData[header] = row[index] || '';
                });

                // Skip empty rows
                if (!rawData.QuestionText || rawData.QuestionText.trim() === '') {
                    continue;
                }

                // Build structured question object
                const question = {
                    id: rawData.QuestionId || `Q${i}`,
                    section: rawData.Section || '',
                    passage: rawData.Passage || '', // NEW: Comprehension/DI passage
                    theme: rawData.Theme || '', // Topic/category
                    order: parseInt(rawData.Order) || i,
                    type: (rawData.Type || 'TEXT').toUpperCase(),
                    text: rawData.QuestionText.trim(),
                    required: (rawData.Required || '').toUpperCase() === 'TRUE',
                    imageUrl: rawData.ImageUrl || '', // Question image
                    timerSeconds: parseInt(rawData.TimerSeconds) || 0, // Timer
                    options: [],
                    constraints: null,
                    goToSectionOnOption: rawData.GoToSectionOnOption || '',
                    rawData, // Keep raw data for admin purposes
                };

                // Parse options with optional images
                for (let j = 1; j <= 5; j++) {
                    const optionText = rawData[`Option${j}`];
                    const optionImageUrl = rawData[`Option${j}ImageUrl`] || ''; // NEW: option images

                    if (optionText && optionText.trim() !== '') {
                        question.options.push({
                            text: optionText.trim(),
                            imageUrl: optionImageUrl, // NEW
                        });
                    }
                }

                // Parse constraints (ConstraintsJson column)
                if (rawData.ConstraintsJson || rawData.Constraints) {
                    try {
                        question.constraints = JSON.parse(rawData.ConstraintsJson || rawData.Constraints);
                    } catch (e) {
                        question.constraints = null;
                    }
                }

                questions.push(question);
            }

            return questions;
        } catch (error) {
            console.error('Error reading questions:', error);
            throw error;
        }
    }

    /**
     * Get form metadata
     */
    async getFormMeta() {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: 'FormMeta!A1:B100',
            });

            const rows = response.data.values;
            if (!rows || rows.length === 0) {
                return {};
            }

            const meta = {};
            for (let i = 1; i < rows.length; i++) {
                const [key, value] = rows[i];
                if (key) {
                    meta[key] = value || '';
                }
            }

            return meta;
        } catch (error) {
            console.error('Error reading form meta:', error);
            throw error;
        }
    }

    /**
     * Update form metadata
     */
    async updateFormMeta(updates) {
        try {
            // First, read current meta to find row positions
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: 'FormMeta!A1:B100',
            });

            const rows = response.data.values;
            const updatesArray = [];

            Object.keys(updates).forEach((key) => {
                const rowIndex = rows.findIndex((row) => row[0] === key);
                if (rowIndex !== -1) {
                    updatesArray.push({
                        range: `FormMeta!B${rowIndex + 1}`,
                        values: [[updates[key]]],
                    });
                }
            });

            if (updatesArray.length > 0) {
                await this.sheets.spreadsheets.values.batchUpdate({
                    spreadsheetId: this.spreadsheetId,
                    resource: {
                        data: updatesArray,
                        valueInputOption: 'USER_ENTERED',
                    },
                });
            }

            return { ok: true, message: 'Metadata updated successfully' };
        } catch (error) {
            console.error('Error updating form meta:', error);
            throw error;
        }
    }

    /**
     * Add a new question
     */
    async addQuestion(questionData) {
        try {
            // Get current questions to append
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: 'Questions!A1:A1',
            });

            const headers = response.data.values ? response.data.values[0] : [];

            // Build row data matching headers
            const rowData = headers.map((header) => questionData[header] || '');

            // Append the new row
            await this.sheets.spreadsheets.values.append({
                spreadsheetId: this.spreadsheetId,
                range: 'Questions!A1',
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [rowData],
                },
            });

            return { ok: true, message: 'Question added successfully' };
        } catch (error) {
            console.error('Error adding question:', error);
            throw error;
        }
    }

    /**
     * Get specific question by ID
     */
    async getQuestionById(questionId) {
        const questions = await this.getQuestions();
        return questions.find((q) => q.QuestionId === questionId);
    }

    /**
     * Delete question by ID
     */
    async deleteQuestion(questionId) {
        // Note: This requires finding the row and deleting it
        // Google Sheets API doesn't have a direct "delete row by value" method
        // You'd need to implement this by:
        // 1. Finding the row index
        // 2. Using batchUpdate with DeleteDimensionRequest
        throw new Error('Delete operation not yet implemented');
    }

    /**
     * Update image URL in sheet for a question or option
     * @param {string} questionId - The question ID
     * @param {string} imageUrl - The image URL to write
     * @param {'QUESTION'|'OPTION'} targetType - Whether this is a question or option image
     * @param {number} optionIndex - The option index (0-4) if targetType is OPTION
     */
    async updateImageUrl(questionId, imageUrl, targetType, optionIndex = null, sheetName = null) {
        try {
            const targetSheet = sheetName || this.currentSheetName;
            // Get all data to find the row
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: `${targetSheet}!A1:Z1000`,
            });

            const rows = response.data.values;
            if (!rows || rows.length === 0) {
                throw new Error('No data found in Questions sheet');
            }

            const headers = rows[0];
            const questionIdIndex = headers.indexOf('QuestionId');

            if (questionIdIndex === -1) {
                throw new Error('QuestionId column not found in sheet');
            }

            // Find the row with this questionId
            let targetRowIndex = -1;
            for (let i = 1; i < rows.length; i++) {
                if (rows[i][questionIdIndex] === questionId) {
                    targetRowIndex = i;
                    break;
                }
            }

            if (targetRowIndex === -1) {
                throw new Error(`Question ${questionId} not found`);
            }

            // Determine which column to update
            let columnName;
            if (targetType === 'QUESTION') {
                columnName = 'ImageUrl';
            } else if (targetType === 'OPTION' && optionIndex !== null) {
                columnName = `Option${optionIndex + 1}ImageUrl`;
            } else {
                throw new Error('Invalid targetType or missing optionIndex');
            }

            const columnIndex = headers.indexOf(columnName);

            // If column doesn't exist, we need to add it
            if (columnIndex === -1) {
                throw new Error(`Column ${columnName} not found. Please add it to your Questions sheet.`);
            }

            // Convert column index to A1 notation (A=0, B=1, etc.)
            const columnLetter = String.fromCharCode(65 + columnIndex);
            const cellAddress = `${targetSheet}!${columnLetter}${targetRowIndex + 1}`;

            // Update the cell
            await this.sheets.spreadsheets.values.update({
                spreadsheetId: this.spreadsheetId,
                range: cellAddress,
                valueInputOption: 'USER_ENTERED',
                resource: {
                    values: [[imageUrl]],
                },
            });

            return { ok: true, message: 'Image URL updated successfully', cellAddress };
        } catch (error) {
            console.error('Error updating image URL:', error);
            throw error;
        }
    }

    /**
     * Update a question's text, options, or constraints
     * @param {string} questionId - The question ID (e.g., "Q001")
     * @param {Object} updates - Fields to update { text?, options?, constraints? }
     */
    async updateQuestion(questionId, updates, sheetName = null) {
        try {
            console.log(`🔍 Looking for question ${questionId} in sheet...`);

            // Get all questions to find the row
            const targetSheet = sheetName || this.currentSheetName;
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: `${targetSheet}!A1:Z1000`,
            });

            const rows = response.data.values;
            if (!rows || rows.length === 0) {
                throw new Error('No data found in Questions sheet');
            }

            const headers = rows[0];
            const targetRowIndex = rows.findIndex((row, index) => index > 0 && row[0] === questionId);

            if (targetRowIndex === -1) {
                throw new Error(`Question ${questionId} not found`);
            }

            console.log(`📍 Found ${questionId} at row ${targetRowIndex + 1}`);

            // Prepare updates
            const updateRequests = [];

            // Update question text
            if (updates.text !== undefined) {
                const colIndex = headers.indexOf('QuestionText');
                if (colIndex !== -1) {
                    const columnLetter = String.fromCharCode(65 + colIndex);
                    console.log(`📝 Updating QuestionText at column ${columnLetter}, row ${targetRowIndex + 1}`);
                    updateRequests.push({
                        range: `${targetSheet}!${columnLetter}${targetRowIndex + 1}`,
                        values: [[updates.text]],
                    });
                } else {
                    console.log('⚠️ QuestionText column not found in headers:', headers);
                }
            }

            // Update options (Option1-Option5)
            if (updates.options !== undefined && Array.isArray(updates.options)) {
                updates.options.forEach((optionText, index) => {
                    const colName = `Option${index + 1}`;
                    const colIndex = headers.indexOf(colName);
                    if (colIndex !== -1) {
                        const columnLetter = String.fromCharCode(65 + colIndex);
                        updateRequests.push({
                            range: `${targetSheet}!${columnLetter}${targetRowIndex + 1}`,
                            values: [[optionText || '']],
                        });
                    }
                });
            }

            // Update constraints
            if (updates.constraints !== undefined) {
                const colIndex = headers.indexOf('ConstraintsJson');
                if (colIndex !== -1) {
                    const columnLetter = String.fromCharCode(65 + colIndex);
                    const constraintsJson = typeof updates.constraints === 'string'
                        ? updates.constraints
                        : JSON.stringify(updates.constraints);
                    updateRequests.push({
                        range: `${targetSheet}!${columnLetter}${targetRowIndex + 1}`,
                        values: [[constraintsJson]],
                    });
                }
            }

            // Update question type
            if (updates.type !== undefined) {
                const colIndex = headers.indexOf('Type');
                if (colIndex !== -1) {
                    const columnLetter = String.fromCharCode(65 + colIndex);
                    console.log(`📝 Updating Type at column ${columnLetter}, row ${targetRowIndex + 1}`);
                    updateRequests.push({
                        range: `${targetSheet}!${columnLetter}${targetRowIndex + 1}`,
                        values: [[updates.type]],
                    });
                } else {
                    console.log('⚠️ Type column not found in headers:', headers);
                }
            }

            // Execute all updates in batch
            if (updateRequests.length > 0) {
                console.log(`📤 Executing ${updateRequests.length} updates to Google Sheets...`);
                console.log('Update details:', JSON.stringify(updateRequests, null, 2));

                const batchResult = await this.sheets.spreadsheets.values.batchUpdate({
                    spreadsheetId: this.spreadsheetId,
                    resource: {
                        valueInputOption: 'USER_ENTERED',
                        data: updateRequests,
                    },
                });

                console.log(`✅ Google Sheets updated successfully. Cells updated: ${batchResult.data.totalUpdatedCells}`);
            } else {
                console.log('⚠️ No updates to perform');
            }

            return { ok: true, message: 'Question updated successfully', updatesCount: updateRequests.length };
        } catch (error) {
            console.error('Error updating question:', error);
            throw error;
        }
    }
}

export default new GoogleSheetsService();

