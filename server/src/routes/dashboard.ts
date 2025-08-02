import express from 'express';
import pool from '../database/connection';

const router = express.Router();

// Get dashboard KPIs
router.get('/kpi', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get arrivals count
    const arrivalsResult = await pool.query(
      'SELECT COUNT(*) as count FROM reservations WHERE check_in = $1',
      [today]
    );

    // Get departures count
    const departuresResult = await pool.query(
      'SELECT COUNT(*) as count FROM reservations WHERE check_out = $1',
      [today]
    );

    // Get total rooms and booked rooms
    const totalRoomsResult = await pool.query('SELECT COUNT(*) as count FROM rooms');
    const bookedRoomsResult = await pool.query(
      "SELECT COUNT(*) as count FROM rooms WHERE status != 'available'"
    );

    const totalRooms = parseInt(totalRoomsResult.rows[0].count);
    const bookedRooms = parseInt(bookedRoomsResult.rows[0].count);
    const occupancyPercentage = totalRooms > 0 ? Math.round((bookedRooms / totalRooms) * 100) : 0;

    res.json({
      arrivals: parseInt(arrivalsResult.rows[0].count),
      departures: parseInt(departuresResult.rows[0].count),
      occupancyPercentage,
      totalRooms,
      bookedRooms
    });
  } catch (error) {
    console.error('Dashboard KPI error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get reservations by type
router.get('/reservations', async (req, res) => {
  try {
    const { type } = req.query;
    const today = new Date().toISOString().split('T')[0];
    
    let query = '';
    let params: any[] = [];

    switch (type) {
      case 'arrivals':
        query = `
          SELECT r.*, rm.room_number, rm.room_type 
          FROM reservations r 
          JOIN rooms rm ON r.room_id = rm.id 
          WHERE r.check_in = $1
        `;
        params = [today];
        break;
      case 'departures':
        query = `
          SELECT r.*, rm.room_number, rm.room_type 
          FROM reservations r 
          JOIN rooms rm ON r.room_id = rm.id 
          WHERE r.check_out = $1
        `;
        params = [today];
        break;
      case 'stayovers':
        query = `
          SELECT r.*, rm.room_number, rm.room_type 
          FROM reservations r 
          JOIN rooms rm ON r.room_id = rm.id 
          WHERE r.check_in < $1 AND r.check_out > $1
        `;
        params = [today];
        break;
      case 'inhouse':
        query = `
          SELECT r.*, rm.room_number, rm.room_type 
          FROM reservations r 
          JOIN rooms rm ON r.room_id = rm.id 
          WHERE r.status = 'checked-in'
        `;
        break;
      default:
        return res.status(400).json({ message: 'Invalid reservation type' });
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Dashboard reservations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;