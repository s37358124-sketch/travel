import express from 'express';
import pool from '../database/connection';

const router = express.Router();

// Get all orders with items
router.get('/', async (req, res) => {
  try {
    const ordersResult = await pool.query(`
      SELECT o.*, rt.table_number, r.room_number
      FROM orders o
      LEFT JOIN restaurant_tables rt ON o.table_id = rt.id
      LEFT JOIN rooms r ON o.room_id = r.id
      ORDER BY o.created_at DESC
    `);

    const orders = ordersResult.rows;

    for (let order of orders) {
      const itemsResult = await pool.query(`
        SELECT oi.*, mi.name, mi.price
        FROM order_items oi
        JOIN menu_items mi ON oi.item_id = mi.id
        WHERE oi.order_id = $1
      `, [order.id]);
      order.items = itemsResult.rows;
    }

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const { order_source, table_id, room_id, items } = req.body;

    // Create order
    const orderResult = await pool.query(`
      INSERT INTO orders (order_source, table_id, room_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [order_source, table_id, room_id]);

    const order = orderResult.rows[0];

    // Add order items
    let totalAmount = 0;
    for (let item of items) {
      await pool.query(`
        INSERT INTO order_items (order_id, item_id, quantity, special_instructions)
        VALUES ($1, $2, $3, $4)
      `, [order.id, item.item_id, item.quantity, item.special_instructions]);

      // Get item price
      const priceResult = await pool.query('SELECT price FROM menu_items WHERE id = $1', [item.item_id]);
      totalAmount += priceResult.rows[0].price * item.quantity;
    }

    // Update order total
    await pool.query('UPDATE orders SET total_amount = $1 WHERE id = $2', [totalAmount, order.id]);

    // Update table status if table order
    if (table_id) {
      await pool.query('UPDATE restaurant_tables SET status = $1 WHERE id = $2', ['occupied', table_id]);
    }

    res.status(201).json({ ...order, total_amount: totalAmount });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(`
      UPDATE orders 
      SET status = $1
      WHERE id = $2
      RETURNING *
    `, [status, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;