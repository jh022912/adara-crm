import pool from '../config/database.js';

export const getLeadsByCompany = async (companyId) => {
  const result = await pool.query(
    'SELECT id, company_id, name, phone, address, status, created_at, updated_at FROM leads WHERE company_id = $1 ORDER BY created_at DESC',
    [companyId]
  );
  return result.rows;
};

export const getLeadById = async (id) => {
  const result = await pool.query(
    'SELECT id, company_id, name, phone, address, status, created_at, updated_at FROM leads WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const createLead = async (companyId, name, phone, address, status = 'new') => {
  const result = await pool.query(
    'INSERT INTO leads (company_id, name, phone, address, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, company_id, name, phone, address, status, created_at, updated_at',
    [companyId, name, phone, address, status]
  );
  return result.rows[0];
};

export const updateLead = async (id, { name, phone, address, status }) => {
  const updates = [];
  const values = [];
  let paramCount = 1;

  if (name !== undefined) {
    updates.push(`name = $${paramCount++}`);
    values.push(name);
  }
  if (phone !== undefined) {
    updates.push(`phone = $${paramCount++}`);
    values.push(phone);
  }
  if (address !== undefined) {
    updates.push(`address = $${paramCount++}`);
    values.push(address);
  }
  if (status !== undefined) {
    updates.push(`status = $${paramCount++}`);
    values.push(status);
  }

  if (updates.length === 0) {
    return await getLeadById(id);
  }

  updates.push(`updated_at = NOW()`);
  values.push(id);

  const query = `UPDATE leads SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, company_id, name, phone, address, status, created_at, updated_at`;
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteLead = async (id) => {
  const result = await pool.query(
    'DELETE FROM leads WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rows[0];
};

export const getLeadByPhone = async (phone) => {
  const result = await pool.query(
    'SELECT id FROM leads WHERE phone = $1',
    [phone]
  );
  return result.rows[0];
};

export const bulkCreateLeads = async (leads) => {
  if (leads.length === 0) return [];

  const values = [];
  let paramCount = 1;
  const placeholders = leads.map(() => {
    const ph = `($${paramCount++}, $${paramCount++}, $${paramCount++}, $${paramCount++})`;
    return ph;
  }).join(', ');

  leads.forEach(lead => {
    values.push(lead.company_id, lead.name, lead.phone, lead.address);
  });

  const query = `INSERT INTO leads (company_id, name, phone, address, status) VALUES ${placeholders} ON CONFLICT DO NOTHING RETURNING id, company_id, name, phone, address, status, created_at, updated_at`;
  const result = await pool.query(query, values);
  return result.rows;
};
