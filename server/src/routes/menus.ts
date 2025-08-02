import express from 'express';
import pool from '../database/connection';

const router = express.Router();

// Get all menus with items
router.get('/', async (req, res) => {
  try {
    const menusResult = await pool.query('SELECT * FROM menus ORDER BY created_at DESC');
    const menus = menusResult.rows;

    for (let menu of menus) {
      const itemsResult = await pool.query(
        'SELECT * FROM menu_items WHERE menu_id = $1 ORDER BY created_at',
        [menu.id]
      );
      menu.items = itemsResult.rows;
    }

    res.json(menus);
  } catch (error) {
    console.error('Get menus error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create new menu
router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;

    const result = await pool.query(`
      INSERT INTO menus (name, description)
      VALUES ($1, $2)
      RETURNING *
    `, [name, description]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create menu error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add item to menu
router.post('/:id/items', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, category, tags } = req.body;

    const result = await pool.query(`
      INSERT INTO menu_items (menu_id, name, description, price, image_url, category, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [id, name, description, price, image_url, category, tags]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Add menu item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update menu item
router.patch('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = [id, ...Object.values(updates)];

    const result = await pool.query(`
      UPDATE menu_items 
      SET ${setClause}
      WHERE id = $1
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete menu item
router.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM menu_items WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;