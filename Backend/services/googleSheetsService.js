import { sheets } from 'googleapis/build/src/apis/sheets/index.js';
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import fs from 'fs';
import path from 'path';

let authClient = null;

export const initializeGoogleAuth = async () => {
  try {
    // Check if we have a service account JSON as environment variable (for production)
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

    if (privateKey && clientEmail) {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          type: 'service_account',
          project_id: process.env.GOOGLE_PROJECT_ID || 'adara-crm',
          private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID || 'key1',
          private_key: privateKey,
          client_email: clientEmail,
          client_id: process.env.GOOGLE_CLIENT_ID || '1',
          auth_uri: 'https://accounts.google.com/o/oauth2/auth',
          token_uri: 'https://oauth2.googleapis.com/token',
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });

      authClient = auth;
      console.log('Google Sheets authentication initialized with service account');
    } else {
      console.warn('Google Sheets credentials not configured in environment variables');
    }
  } catch (error) {
    console.error('Error initializing Google authentication:', error);
  }
};

export const getGoogleSheetsData = async () => {
  try {
    if (!authClient) {
      await initializeGoogleAuth();
    }

    if (!authClient) {
      throw new Error('Google authentication not initialized');
    }

    const sheetsAPI = google.sheets({ version: 'v4', auth: authClient });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_ID not configured');
    }

    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A:D', // Columns: Name, Phone, Address, Status
    });

    const rows = response.data.values || [];
    return rows.slice(1); // Skip header row
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    return [];
  }
};

export const parseLeadRow = (row) => {
  return {
    name: row[0] || '',
    phone: row[1] || '',
    address: row[2] || '',
    status: row[3] || 'new',
  };
};
