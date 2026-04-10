import { sheets } from 'googleapis/build/src/apis/sheets/index.js';
import { google } from 'googleapis';

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
      range: 'Sheet1!A:T', // All columns up to lead_status
    });

    const rows = response.data.values || [];
    return rows.slice(1); // Skip header row
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    return [];
  }
};

export const parseLeadRow = (row) => {
  // Column mapping based on sheet structure:
  // A(0)=id, B(1)=created_time, C(2)=ad_id, D(3)=ad_name, E(4)=adset_id,
  // F(5)=adset_name, G(6)=campaign_id, H(7)=campaign_name, I(8)=form_id,
  // J(9)=form_name, K(10)=is_organic, L(11)=platform, M(12)=pest_issues,
  // N(13)=email, O(14)=full_name, P(15)=phone_number, Q(16)=street_address,
  // R(17)=city, S(18)=state, T(19)=lead_status

  const rawPhone = row[15] || '';
  // Remove "p:" prefix from phone numbers
  const phone = rawPhone.replace(/^p:/, '').trim().slice(0, 20);

  const street = row[16] || '';
  const city = row[17] || '';
  const state = row[18] || '';
  const addressParts = [street, city, state].filter(Boolean);
  const address = addressParts.join(', ').slice(0, 255);

  return {
    name: (row[14] || '').slice(0, 100),
    phone,
    address,
    status: (row[19] || 'new').slice(0, 50),
    isTestLead: rawPhone.includes('<test') || (row[14] || '').includes('<test'),
  };
};
