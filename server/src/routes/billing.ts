import express from 'express';
import pool from '../database/connection';

const router = express.Router();

// Get all restaurant tables with status
router.get('/tables', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurant_tables ORDER BY table_number');
    res.json(result.rows);
  } catch (error) {
    console.error('Get tables error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get bill for specific table
router.get('/:tableId', async (req, res) => {
  try {
    const { tableId } = req.params;

    // Get active orders for table
    const ordersResult = await pool.query(`
      SELECT o.*, rt.table_number
      FROM orders o
      JOIN restaurant_tables rt ON o.table_id = rt.id
      WHERE o.table_id = $1 AND o.status != 'paid'
    `, [tableId]);

    if (ordersResult.rows.length === 0) {
      return res.json({ orders: [], total: 0 });
    }

    const orders = ordersResult.rows;
    let grandTotal = 0;

    for (let order of orders) {
      const itemsResult = await pool.query(`
        SELECT oi.*, mi.name, mi.price
        FROM order_items oi
        JOIN menu_items mi ON oi.item_id = mi.id
        WHERE oi.order_id = $1
      `, [order.id]);
      
      order.items = itemsResult.rows;
      order.subtotal = itemsResult.rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      grandTotal += order.subtotal;
    }

    res.json({
      orders,
      total: grandTotal,
      table_number: orders[0].table_number
    });
  } catch (error) {
    console.error('Get bill error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Mark table as paid
router.post('/:tableId/pay', async (req, res) => {
  try {
    const { tableId } = req.params;
    const { payment_method } = req.body;

    // Update all orders for this table as paid
    await pool.query(`
      UPDATE orders 
      SET status = 'paid'
      WHERE table_id = $1 AND status != 'paid'
    `, [tableId]);

    // Update table status to available
    await pool.query(`
      UPDATE restaurant_tables 
      SET status = 'available'
      WHERE id = $1
    `, [tableId]);

    res.json({ message: 'Payment processed successfully' });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;