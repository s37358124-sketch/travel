import express from 'express';
import pool from '../database/connection';

const router = express.Router();

// Get all properties
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM properties ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new property
router.post('/', async (req, res) => {
  try {
    const { name, type, rating, languages, address, latitude, longitude } = req.body;

    const result = await pool.query(`
      INSERT INTO properties (name, type, rating, languages, address, latitude, longitude)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [name, type, rating, languages, address, latitude, longitude]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all rooms
router.get('/rooms', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, p.name as property_name
      FROM rooms r
      JOIN properties p ON r.property_id = p.id
      ORDER BY r.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new room
router.post('/rooms', async (req, res) => {
  try {
    const { property_id, room_number, room_type, size, beds, bathroom_type, amenities, price } = req.body;

    const result = await pool.query(`
      INSERT INTO rooms (property_id, room_number, room_type, size, beds, bathroom_type, amenities, price)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [property_id, room_number, room_type, size, beds, bathroom_type, amenities, price]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;