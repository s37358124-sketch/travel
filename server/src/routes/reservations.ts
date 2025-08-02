import express from 'express';
import pool from '../database/connection';

const router = express.Router();

// Get all reservations
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, rm.room_number, rm.room_type, p.name as property_name
      FROM reservations r
      JOIN rooms rm ON r.room_id = rm.id
      JOIN properties p ON rm.property_id = p.id
      ORDER BY r.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get reservation by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT r.*, rm.room_number, rm.room_type, rm.amenities, p.name as property_name, p.address
      FROM reservations r
      JOIN rooms rm ON r.room_id = rm.id
      JOIN properties p ON rm.property_id = p.id
      WHERE r.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get reservation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new reservation
router.post('/', async (req, res) => {
  try {
    const { guest_name, contact_number, source, check_in, check_out, room_id, total_price } = req.body;

    // Check if room is available
    const roomCheck = await pool.query(
      'SELECT status FROM rooms WHERE id = $1',
      [room_id]
    );

    if (roomCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (roomCheck.rows[0].status !== 'available') {
      return res.status(400).json({ message: 'Room is not available' });
    }

    // Create reservation
    const result = await pool.query(`
      INSERT INTO reservations (guest_name, contact_number, source, check_in, check_out, room_id, total_price)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [guest_name, contact_number, source, check_in, check_out, room_id, total_price]);

    // Update room status
    await pool.query(
      'UPDATE rooms SET status = $1 WHERE id = $2',
      ['booked', room_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update reservation
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = [id, ...Object.values(updates)];

    const result = await pool.query(`
      UPDATE reservations 
      SET ${setClause}
      WHERE id = $1
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update reservation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get calendar reservations
router.get('/calendar/range', async (req, res) => {
  try {
    const { start, end } = req.query;

    const result = await pool.query(`
      SELECT r.*, rm.room_number, rm.room_type
      FROM reservations r
      JOIN rooms rm ON r.room_id = rm.id
      WHERE r.check_in <= $2 AND r.check_out >= $1
      ORDER BY r.check_in
    `, [start, end]);

    res.json(result.rows);
  } catch (error) {
    console.error('Calendar reservations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;