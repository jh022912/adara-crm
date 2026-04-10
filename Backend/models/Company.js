import pool from '../config/database.js';

export const getAllCompanies = async () => {
  const result = await pool.query(
    'SELECT id, name, created_at FROM companies ORDER BY created_at DESC'
  );
  return result.rows;
};

export const getCompanyById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, created_at FROM companies WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const createCompany = async (name) => {
  const result = await pool.query(
    'INSERT INTO companies (name) VALUES ($1) RETURNING id, name, created_at',
    [name]
  );
  return result.rows[0];
};

export const updateCompany = async (id, name) => {
  const result = await pool.query(
    'UPDATE companies SET name = $1 WHERE id = $2 RETURNING id, name, created_at',
    [name, id]
  );
  return result.rows[0];
};

export const deleteCompany = async (id) => {
  const result = await pool.query(
    'DELETE FROM companies WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rows[0];
};
