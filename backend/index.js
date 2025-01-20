const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Database configuration for Neon PostgreSQL
const pool = new Pool({
  connectionString: process.env.NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon to allow secure connections
  },
});

pool.connect()
  .then(() => {
    console.log('Connected to the Neon PostgreSQL database successfully');
  })
  .catch((err) => {
    console.error('Failed to connect to the Neon PostgreSQL database:', err);
  })

// Middleware
app.use(cors());
app.use(express.json());

const initializeDatabase = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      branch VARCHAR(255) NOT NULL,
      address TEXT NOT NULL,
      admission_year INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS update_students_updated_at ON students;

    CREATE TRIGGER update_students_updated_at
      BEFORE UPDATE ON students
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  `;

  try {
    // Connect to the database
    const client = await pool.connect();
    console.log('Database connected successfully.');

    // Run the schema setup
    await client.query(createTableQuery);
    console.log('Database initialized successfully.');

    // Release the client back to the pool
    client.release();
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// initializeDatabase()

// Routes
app.get('/api/students', async (req, res) => {
  console.log('here')
  try {
    const result = await pool.query(
      'SELECT * FROM students ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.get('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { name, branch, address, admission_year } = req.body;
    const result = await pool.query(
      'INSERT INTO students (name, branch, address, admission_year) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, branch, address, admission_year]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create student' });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, branch, address } = req.body;
    const result = await pool.query(
      'UPDATE students SET name = $1, branch = $2, address = $3 WHERE id = $4 RETURNING *',
      [name, branch, address, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update student' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM students WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
