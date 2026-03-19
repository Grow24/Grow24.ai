const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

// Log all requests to whatsapp routes
router.use((req, res, next) => {
    console.log(`🌐 WhatsApp route hit: ${req.method} ${req.path}`);
    console.log(`🌐 Headers:`, req.headers);
    console.log(`🌐 Body:`, req.body);
    next();
});

// Configuration
const WAPI_URL = process.env.WAPI_URL; // Your WAPI base URL
const WAPI_VENDOR_UID = process.env.WAPI_VENDOR_UID; // Your vendor UID
const WAPI_TOKEN = process.env.WAPI_TOKEN; // Your access token
// Use environment variable or default to localhost for development
const PBMP_API_URL = process.env.PBMP_API_URL || `http://localhost:${process.env.PORT || 3000}/api/chat`;

// Log configuration on startup (without exposing tokens)
console.log('📱 WhatsApp Service Configuration:');
console.log('   WAPI_URL:', WAPI_URL || '❌ NOT SET');
console.log('   WAPI_VENDOR_UID:', WAPI_VENDOR_UID ? '✅ Set' : '❌ NOT SET');
console.log('   WAPI_TOKEN:', WAPI_TOKEN ? '✅ Set' : '❌ NOT SET');
console.log('   PBMP_API_URL:', PBMP_API_URL);

// Session storage (use Redis in production)
const sessions = new Map();

// Session structure
function createSession(phoneNumber) {
    return {
        phoneNumber,
        conversationHistory: [],
        bookingState: null, // null, 'name', 'email', 'phone', 'date', 'time'
        bookingData: {},
        lastActivity: Date.now(),
        messageCount: 0
    };
}

// Clean up old sessions (call periodically)
function cleanOldSessions() {
    const now = Date.now();
    const TIMEOUT = 30 * 60 * 1000; // 30 minutes

    for (const [phone, session] of sessions.entries()) {
        if (now - session.lastActivity > TIMEOUT) {
            sessions.delete(phone);
            console.log(`🧹 Cleaned up session for ${phone}`);
        }
    }
}

setInterval(cleanOldSessions, 5 * 60 * 1000); // Every 5 minutes

// Get or create session
function getSession(phoneNumber) {
    if (!sessions.has(phoneNumber)) {
        sessions.set(phoneNumber, createSession(phoneNumber));
        console.log(`✨ Created new session for ${phoneNumber}`);
    }
    const session = sessions.get(phoneNumber);
    session.lastActivity = Date.now();
    return session;
}

// Send WhatsApp message via WAPI
async function sendWhatsAppMessage(phoneNumber, message, buttons = null) {
    try {
        if (!WAPI_URL || !WAPI_VENDOR_UID || !WAPI_TOKEN) {
            throw new Error('WAPI credentials not configured. Check .env file.');
        }

        const payload = {
            phone_number: phoneNumber,
            message_body: message  // WAPI expects message_body, not message
        };

        // Construct the endpoint URL
        const endpoint = `${WAPI_URL}/${WAPI_VENDOR_UID}/contact/send-message`;

        console.log(`📤 Sending message to ${phoneNumber} via ${endpoint}`);
        console.log(`📤 Payload:`, JSON.stringify(payload, null, 2));

        const response = await axios.post(
            endpoint,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${WAPI_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log(`✅ Sent message to ${phoneNumber}`);
        console.log(`✅ Response:`, JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error('❌ Error sending WhatsApp message:', error.message);
        if (error.response) {
            console.error('❌ Response data:', JSON.stringify(error.response.data, null, 2));
            console.error('❌ Response status:', error.response.status);
            console.error('❌ Response headers:', JSON.stringify(error.response.headers, null, 2));
        }
        if (error.request) {
            console.error('❌ Request made but no response:', error.request);
        }
        throw error;
    }
}

// Format PBMP response for WhatsApp
function formatForWhatsApp(text) {
    // Convert markdown to WhatsApp formatting
    let formatted = text
        .replace(/\*\*(.*?)\*\*/g, '*$1*') // Bold
        .replace(/__(.*?)__/g, '_$1_')     // Italic
        .replace(/~~(.*?)~~/g, '~$1~')     // Strikethrough
        .replace(/```(.*?)```/gs, '```$1```'); // Code

    // Trim to WhatsApp message limit (4096 chars)
    if (formatted.length > 4096) {
        formatted = formatted.substring(0, 4090) + '...\n\n_Message truncated_';
    }

    return formatted;
}

// Handle booking flow in WhatsApp
function handleBookingFlow(session, userMessage) {
    const { bookingState, bookingData } = session;

    switch (bookingState) {
        case 'name':
            bookingData.name = userMessage;
            session.bookingState = 'email';
            return {
                message: '📧 *Great!* What\'s your email address?',
                continueFlow: true
            };

        case 'email':
            if (!isValidEmail(userMessage)) {
                return {
                    message: '❌ Please provide a valid email address.\n\nExample: john@example.com',
                    continueFlow: true
                };
            }
            bookingData.email = userMessage;
            session.bookingState = 'phone';
            return {
                message: '📱 What\'s your phone number?',
                continueFlow: true
            };

        case 'phone':
            bookingData.phone = userMessage;
            session.bookingState = 'date';
            return {
                message: '📅 What date works for you?\n\n_Format: MM/DD/YYYY_\nExample: 01/25/2026',
                continueFlow: true
            };

        case 'date':
            if (!isValidDate(userMessage)) {
                return {
                    message: '❌ Please provide a valid date in MM/DD/YYYY format.\n\nExample: 01/25/2026',
                    continueFlow: true
                };
            }
            bookingData.date = userMessage;
            session.bookingState = 'time';
            return {
                message: '⏰ What time works best for you?\n\n_Format: HH:MM AM/PM_\nExample: 10:00 AM',
                continueFlow: true
            };

        case 'time':
            if (!isValidTime(userMessage)) {
                return {
                    message: '❌ Please provide a valid time in HH:MM AM/PM format.\n\nExample: 10:00 AM or 02:30 PM',
                    continueFlow: true
                };
            }
            bookingData.time = userMessage;
            session.bookingState = 'confirm';

            return {
                message: `📋 *Please confirm your booking:*\n\n` +
                    `👤 *Name:* ${bookingData.name}\n` +
                    `📧 *Email:* ${bookingData.email}\n` +
                    `📱 *Phone:* ${bookingData.phone}\n` +
                    `📅 *Date:* ${bookingData.date}\n` +
                    `⏰ *Time:* ${bookingData.time}\n\n` +
                    `Reply with *"Confirm"* to book or *"Cancel"* to cancel.`,
                continueFlow: true
            };

        case 'confirm':
            const lowerMsg = userMessage.toLowerCase();
            if (lowerMsg.includes('confirm') || lowerMsg.includes('yes')) {
                return {
                    message: null, // Will save to backend
                    continueFlow: false,
                    saveBooking: true
                };
            } else if (lowerMsg.includes('cancel') || lowerMsg.includes('no')) {
                session.bookingState = null;
                session.bookingData = {};
                return {
                    message: '❌ Booking cancelled.\n\nHow else can I help you?',
                    continueFlow: false
                };
            } else {
                return {
                    message: 'Please reply with *"Confirm"* to proceed or *"Cancel"* to cancel.',
                    continueFlow: true
                };
            }

        default:
            return null;
    }
}

// Validation helpers
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidDate(date) {
    return /^\d{2}\/\d{2}\/\d{4}$/.test(date);
}

function isValidTime(time) {
    return /^\d{1,2}:\d{2}\s?(AM|PM|am|pm)$/i.test(time);
}

// Save booking to backend
async function saveBooking(bookingData) {
    try {
        const response = await axios.post('http://localhost:3000/api/leads', {
            name: bookingData.name,
            email: bookingData.email,
            phone: bookingData.phone,
            date: bookingData.date,
            time: bookingData.time,
            contactPerson: 'PBMP ChatBot',
            notes: 'Booked via WhatsApp'
        });
        console.log(`✅ Booking saved for ${bookingData.name}`);
        return response.data;
    } catch (error) {
        console.error('❌ Error saving booking:', error.message);
        throw error;
    }
}

// Process message with PBMP AI
async function queryPBMP(message, conversationHistory) {
    try {
        // Build messages array in the format expected by /api/chat
        const messages = [];

        // Add conversation history if available
        if (conversationHistory && conversationHistory.length > 0) {
            conversationHistory.forEach(msg => {
                messages.push({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ type: 'text', text: msg.content }]
                });
            });
        }

        // Add current message
        messages.push({
            role: 'user',
            parts: [{ type: 'text', text: message }]
        });

        const response = await axios.post(
            PBMP_API_URL,
            { messages },
            {
                headers: { 'Content-Type': 'application/json' },
                responseType: 'text',
                timeout: 30000 // 30 second timeout
            }
        );

        // Parse streaming response
        let fullResponse = '';
        const lines = response.data.split('\n');

        for (const line of lines) {
            if (line.trim().startsWith('0:')) {
                try {
                    const jsonStr = line.substring(2);
                    const parsed = JSON.parse(jsonStr);
                    fullResponse += parsed;
                } catch (e) {
                    // Skip parsing errors
                }
            }
        }

        return fullResponse || 'I apologize, but I encountered an error. Please try again.';
    } catch (error) {
        console.error('❌ Error querying PBMP:', error.message);
        return 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.';
    }
}

// Webhook endpoint for incoming WhatsApp messages
router.post('/webhook', async (req, res) => {
    try {
        console.log('🔔 WEBHOOK CALLED - Method:', req.method);
        console.log('🔔 WEBHOOK CALLED - Headers:', JSON.stringify(req.headers, null, 2));
        console.log('🔔 WEBHOOK CALLED - Body:', JSON.stringify(req.body, null, 2));
        console.log('🔔 WEBHOOK CALLED - Raw body:', req.body);

        const { contact, message } = req.body;

        console.log('📥 Incoming webhook:', JSON.stringify(req.body, null, 2));

        // Extract phone number and message body
        const phoneNumber = contact?.phone_number;
        const userMessage = message?.body?.trim();

        // Skip if it's not a new text message or if message is empty
        if (!message?.is_new_message || !userMessage) {
            console.log('⏭️  Skipping - not a new text message');
            return res.status(200).json({ success: true });
        }

        const session = getSession(phoneNumber);

        console.log(`📱 WhatsApp message from ${phoneNumber}: ${userMessage}`);
        session.messageCount++;

        // Handle commands
        if (userMessage.toLowerCase() === '/reset' || userMessage.toLowerCase() === '/start') {
            session.conversationHistory = [];
            session.bookingState = null;
            session.bookingData = {};

            try {
                await sendWhatsAppMessage(
                    phoneNumber,
                    '👋 *Welcome to PBMP ChatBot!*\n\n' +
                    'Your Personal & Business Management Platform assistant from Grow24.ai.\n\n' +
                    '*I can help you with:*\n' +
                    '• Understanding PBMP features\n' +
                    '• Booking consultations\n' +
                    '• Answering management questions\n\n' +
                    'How can I assist you today?'
                );
            } catch (sendError) {
                console.error('❌ Failed to send welcome message:', sendError.message);
                // Don't throw - still return success to webhook
            }

            return res.status(200).json({ success: true });
        }

        // Handle booking flow
        if (session.bookingState) {
            const flowResult = handleBookingFlow(session, userMessage);

            if (flowResult.saveBooking) {
                // Save booking to backend
                try {
                    await saveBooking(session.bookingData);
                    await sendWhatsAppMessage(
                        phoneNumber,
                        '✅ *Meeting booked successfully!*\n\n' +
                        `📅 ${session.bookingData.date} at ${session.bookingData.time}\n\n` +
                        'We\'ll send you a confirmation email shortly.\n\n' +
                        'Is there anything else I can help you with?'
                    );

                    // Reset booking state
                    session.bookingState = null;
                    session.bookingData = {};
                } catch (error) {
                    await sendWhatsAppMessage(
                        phoneNumber,
                        '❌ Sorry, there was an error booking your meeting. Please try again or contact support.'
                    );
                }
            } else {
                await sendWhatsAppMessage(phoneNumber, flowResult.message);
            }

            return res.status(200).json({ success: true });
        }

        // Check if user wants to book
        const bookingKeywords = ['book', 'meeting', 'appointment', 'schedule', 'consultation', 'call'];
        if (bookingKeywords.some(kw => userMessage.toLowerCase().includes(kw))) {
            session.bookingState = 'name';
            session.bookingData = {};

            await sendWhatsAppMessage(
                phoneNumber,
                '📅 *Great! Let\'s book a meeting.*\n\n' +
                'First, what\'s your name?'
            );

            return res.status(200).json({ success: true });
        }

        // Regular AI conversation
        session.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        // Query PBMP backend
        let aiResponse;
        try {
            aiResponse = await queryPBMP(userMessage, session.conversationHistory);
        } catch (queryError) {
            console.error('❌ Error querying PBMP:', queryError.message);
            aiResponse = 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.';
        }

        session.conversationHistory.push({
            role: 'assistant',
            content: aiResponse
        });

        // Keep only last 10 messages for context
        if (session.conversationHistory.length > 20) {
            session.conversationHistory = session.conversationHistory.slice(-20);
        }

        // Format and send response
        const formattedResponse = formatForWhatsApp(aiResponse);
        try {
            await sendWhatsAppMessage(phoneNumber, formattedResponse);
        } catch (sendError) {
            console.error('❌ Failed to send WhatsApp response:', sendError.message);
            // Don't throw - webhook should still return success
        }

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('❌ Webhook error:', error);
        console.error('❌ Error stack:', error.stack);
        console.error('❌ Error details:', {
            message: error.message,
            name: error.name,
            code: error.code
        });
        res.status(500).json({
            error: 'Internal server error',
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Webhook verification (for some BSPs like Meta WhatsApp Business API)
router.get('/webhook', (req, res) => {
    const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN || 'your_verify_token';
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('🔐 Webhook verification request');

    if (token === verifyToken) {
        console.log('✅ Webhook verified');
        res.status(200).send(challenge);
    } else {
        console.log('❌ Webhook verification failed');
        res.status(403).send('Forbidden');
    }
});

// Status endpoint
router.get('/status', (req, res) => {
    res.json({
        status: 'active',
        activeSessions: sessions.size,
        timestamp: new Date().toISOString()
    });
});

// Test endpoint
router.post('/test', async (req, res) => {
    try {
        console.log('🧪 Test endpoint called');
        console.log('🧪 WAPI_URL:', WAPI_URL);
        console.log('🧪 WAPI_VENDOR_UID:', WAPI_VENDOR_UID ? 'Set' : 'Not set');
        console.log('🧪 WAPI_TOKEN:', WAPI_TOKEN ? 'Set' : 'Not set');

        const { phone, message } = req.body;
        if (!phone || !message) {
            return res.status(400).json({
                success: false,
                error: 'phone and message required',
                received: { phone, message }
            });
        }

        await sendWhatsAppMessage(phone, message);
        res.json({ success: true, message: 'Message sent' });
    } catch (error) {
        console.error('❌ Test endpoint error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

module.exports = router;
