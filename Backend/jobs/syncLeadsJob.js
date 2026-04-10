import cron from 'node-cron';
import { getGoogleSheetsData, parseLeadRow, initializeGoogleAuth } from '../services/googleSheetsService.js';
import { getLeadByPhone, createLead } from '../models/Lead.js';
import { getAllCompanies } from '../models/Company.js';

let syncJob = null;

export const startSyncJob = async () => {
  // Initialize Google auth
  await initializeGoogleAuth();

  // Run sync every 5 minutes (can adjust to 10 minutes if needed)
  syncJob = cron.schedule('*/5 * * * *', async () => {
    console.log('Starting Google Sheets sync...');
    await syncLeadsFromGoogleSheets();
  });

  console.log('Google Sheets sync job started (runs every 5 minutes)');
};

export const stopSyncJob = () => {
  if (syncJob) {
    syncJob.stop();
    console.log('Google Sheets sync job stopped');
  }
};

export const syncLeadsFromGoogleSheets = async () => {
  try {
    const rows = await getGoogleSheetsData();

    if (rows.length === 0) {
      console.log('No data from Google Sheets');
      return;
    }

    // Get the default company (first one or create if doesn't exist)
    const companies = await getAllCompanies();
    if (companies.length === 0) {
      console.warn('No companies found in database. Create a company first.');
      return;
    }

    const defaultCompany = companies[0];
    let newLeadsCount = 0;

    for (const row of rows) {
      const leadData = parseLeadRow(row);

      // Check if lead with this phone already exists
      const existingLead = await getLeadByPhone(leadData.phone);

      if (!existingLead) {
        // Create new lead
        try {
          await createLead(
            defaultCompany.id,
            leadData.name,
            leadData.phone,
            leadData.address,
            leadData.status
          );
          newLeadsCount++;
        } catch (error) {
          console.error(`Error creating lead for phone ${leadData.phone}:`, error);
        }
      }
    }

    console.log(`Sync completed. New leads added: ${newLeadsCount}`);
  } catch (error) {
    console.error('Error during Google Sheets sync:', error);
  }
};

// Manual sync endpoint handler
export const manualSyncHandler = async (req, res) => {
  try {
    await syncLeadsFromGoogleSheets();
    res.json({ message: 'Sync completed successfully' });
  } catch (error) {
    console.error('Manual sync error:', error);
    res.status(500).json({ error: 'Sync failed' });
  }
};
