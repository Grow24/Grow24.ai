import { google } from 'googleapis';
import dotenv from 'dotenv';
import oauth2Service from './oauth2.js';

dotenv.config();

class GoogleFormsService {
    constructor() {
        this.forms = null;
        this.initialize();
    }

    async initialize() {
        try {
            console.log('✅ Google Forms API initialized (will use OAuth2 client when creating forms)');
        } catch (error) {
            console.error('❌ Failed to initialize Google Forms API:', error.message);
            throw error;
        }
    }

    /**
     * Get the OAuth2 client for authenticated requests
     * @private
     */
    async _getAuthClient() {
        const authClient = await oauth2Service.getAuthenticatedClient();
        if (!authClient) {
            throw new Error('Not authenticated with Google. Please connect Google Drive first.');
        }
        return authClient;
    }

    /**
     * Create a new Google Form with questions
     * @param {Object} options - Form configuration
     * @param {string} options.title - Form title
     * @param {string} options.description - Form description
     * @param {Array} options.respondentFields - Respondent detail fields
     * @param {Array} options.questions - Assessment questions
     * @returns {Promise<Object>} - Form data (formId, editUrl, publishedUrl, etc.)
     */
    async createForm({ title, description, respondentFields = [], questions = [] }) {
        try {
            // Get OAuth2 authenticated client
            const authClient = await this._getAuthClient();
            const forms = google.forms({ version: 'v1', auth: authClient });

            // Step 1: Create a blank form
            const createResponse = await forms.forms.create({
                requestBody: {
                    info: {
                        title: title || 'Untitled Form',
                        documentTitle: title || 'Untitled Form',
                    },
                },
            });

            const formId = createResponse.data.formId;
            const editUrl = `https://docs.google.com/forms/d/${formId}/edit`;
            const publishedUrl = createResponse.data.responderUri;

            console.log(`✅ Form created: ${formId}`);

            // Step 2: Build batch update requests
            const requests = [];

            // Add form description
            if (description) {
                requests.push({
                    updateFormInfo: {
                        info: {
                            description: description,
                        },
                        updateMask: 'description',
                    },
                });
            }

            // Step 3: Add Respondent Details Section
            if (respondentFields.length > 0) {
                // Add page break for respondent details
                requests.push({
                    createItem: {
                        item: {
                            title: 'Respondent Details',
                            description: 'Please provide your information before starting the assessment.',
                            pageBreakItem: {},
                        },
                        location: {
                            index: 0,
                        },
                    },
                });

                // Add each respondent field
                respondentFields.forEach((field, index) => {
                    const questionItem = this._buildRespondentFieldItem(field);
                    requests.push({
                        createItem: {
                            item: questionItem,
                            location: {
                                index: index + 1, // After the page break
                            },
                        },
                    });
                });
            }

            // Step 4: Add Assessment Questions
            const startIndex = respondentFields.length + 1; // After respondent section
            questions.forEach((question, index) => {
                const questionItem = this._buildQuestionItem(question);
                if (questionItem) {
                    requests.push({
                        createItem: {
                            item: questionItem,
                            location: {
                                index: startIndex + index,
                            },
                        },
                    });
                }
            });

            // Step 5: Execute all updates in a single batch
            if (requests.length > 0) {
                await forms.forms.batchUpdate({
                    formId: formId,
                    requestBody: {
                        requests: requests,
                    },
                });
                console.log(`✅ Added ${requests.length} items to form`);
            }

            // Step 6: Set up response collection (create linked spreadsheet)
            const drive = google.drive({ version: 'v3', auth: authClient });
            const responseSpreadsheet = await drive.files.create({
                requestBody: {
                    name: `${title} (Responses)`,
                    mimeType: 'application/vnd.google-apps.spreadsheet',
                },
                fields: 'id,webViewLink',
            });

            const responseSpreadsheetId = responseSpreadsheet.data.id;
            const responseSpreadsheetUrl = responseSpreadsheet.data.webViewLink;

            // Link the form to the response spreadsheet
            await forms.forms.batchUpdate({
                formId: formId,
                requestBody: {
                    requests: [
                        {
                            updateSettings: {
                                settings: {
                                    quizSettings: {
                                        isQuiz: false,
                                    },
                                },
                                updateMask: 'quizSettings',
                            },
                        },
                    ],
                },
            });

            console.log(`✅ Response spreadsheet created: ${responseSpreadsheetId}`);

            return {
                formId,
                editUrl,
                publishedUrl,
                responseSpreadsheetId,
                responseSpreadsheetUrl,
                stats: {
                    respondentFieldsCount: respondentFields.length,
                    questionsCount: questions.length,
                    totalItems: requests.length,
                },
            };
        } catch (error) {
            console.error('❌ Error creating form:', error);
            throw new Error(`Failed to create form: ${error.message}`);
        }
    }

    /**
     * Build a question item for respondent details
     * @private
     */
    _buildRespondentFieldItem(field) {
        // Google Forms doesn't allow newlines in titles, so replace them with spaces
        const cleanTitle = (field.FieldName || field.Field || 'Untitled Field').replace(/\n/g, ' ').trim();
        
        const item = {
            title: cleanTitle,
            description: field.Description || '',
        };

        const isRequired = (field.Required || '').toUpperCase() === 'TRUE';

        switch ((field.Type || 'TEXT').toUpperCase()) {
            case 'TEXT':
            case 'SHORT_ANSWER':
                item.questionItem = {
                    question: {
                        required: isRequired,
                        textQuestion: {
                            paragraph: false,
                        },
                    },
                };
                break;

            case 'PARAGRAPH':
            case 'LONG_ANSWER':
                item.questionItem = {
                    question: {
                        required: isRequired,
                        textQuestion: {
                            paragraph: true,
                        },
                    },
                };
                break;

            case 'MCQ':
            case 'MULTIPLE_CHOICE':
                const mcqOptions = this._extractOptions(field);
                item.questionItem = {
                    question: {
                        required: isRequired,
                        choiceQuestion: {
                            type: 'RADIO',
                            options: mcqOptions.map(opt => ({ value: opt })),
                        },
                    },
                };
                break;

            case 'DROPDOWN':
                const dropdownOptions = this._extractOptions(field);
                item.questionItem = {
                    question: {
                        required: isRequired,
                        choiceQuestion: {
                            type: 'DROP_DOWN',
                            options: dropdownOptions.map(opt => ({ value: opt })),
                        },
                    },
                };
                break;

            default:
                item.questionItem = {
                    question: {
                        required: isRequired,
                        textQuestion: {
                            paragraph: false,
                        },
                    },
                };
        }

        return item;
    }

    /**
     * Build a question item for assessment questions
     * @private
     */
    _buildQuestionItem(question) {
        // Google Forms doesn't allow newlines in titles, so replace them with spaces
        const cleanTitle = (question.text || 'Untitled Question').replace(/\n/g, ' ').trim();
        
        const item = {
            title: cleanTitle,
            description: question.description || '',
        };

        const isRequired = question.required === true || question.required === 'TRUE';

        switch (question.type) {
            case 'TEXT':
            case 'SHORT_ANSWER':
                item.questionItem = {
                    question: {
                        required: isRequired,
                        textQuestion: {
                            paragraph: false,
                        },
                    },
                };
                break;

            case 'PARAGRAPH':
            case 'LONG_ANSWER':
                item.questionItem = {
                    question: {
                        required: isRequired,
                        textQuestion: {
                            paragraph: true,
                        },
                    },
                };
                break;

            case 'MCQ':
            case 'MULTIPLE_CHOICE':
                if (question.options && question.options.length > 0) {
                    item.questionItem = {
                        question: {
                            required: isRequired,
                            choiceQuestion: {
                                type: 'RADIO',
                                options: question.options.map(opt => ({
                                    value: typeof opt === 'string' ? opt : opt.text,
                                })),
                            },
                        },
                    };
                }
                break;

            case 'CHECKBOX':
                if (question.options && question.options.length > 0) {
                    item.questionItem = {
                        question: {
                            required: isRequired,
                            choiceQuestion: {
                                type: 'CHECKBOX',
                                options: question.options.map(opt => ({
                                    value: typeof opt === 'string' ? opt : opt.text,
                                })),
                            },
                        },
                    };
                }
                break;

            case 'DROPDOWN':
                if (question.options && question.options.length > 0) {
                    item.questionItem = {
                        question: {
                            required: isRequired,
                            choiceQuestion: {
                                type: 'DROP_DOWN',
                                options: question.options.map(opt => ({
                                    value: typeof opt === 'string' ? opt : opt.text,
                                })),
                            },
                        },
                    };
                }
                break;

            case 'LINEAR_SCALE':
                item.questionItem = {
                    question: {
                        required: isRequired,
                        scaleQuestion: {
                            low: question.scaleMin || 1,
                            high: question.scaleMax || 5,
                            lowLabel: question.scaleLowLabel || '',
                            highLabel: question.scaleHighLabel || '',
                        },
                    },
                };
                break;

            default:
                // Default to short answer
                item.questionItem = {
                    question: {
                        required: isRequired,
                        textQuestion: {
                            paragraph: false,
                        },
                    },
                };
        }

        // Add image if present
        if (question.imageUrl) {
            item.questionItem.image = {
                sourceUri: question.imageUrl,
            };
        }

        return item;
    }

    /**
     * Extract options from a field object (Option1, Option2, etc.)
     * @private
     */
    _extractOptions(field) {
        const options = [];
        for (let i = 1; i <= 10; i++) {
            const optionKey = `Option${i}`;
            if (field[optionKey] && field[optionKey].trim() !== '') {
                options.push(field[optionKey].trim());
            }
        }
        return options;
    }
}

// Export singleton instance
const googleFormsService = new GoogleFormsService();
export default googleFormsService;

