import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const createTables = async () => {
  const client = await pool.connect();
  
  try {
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create properties table
    await client.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT,
        rating INT,
        languages TEXT[],
        address TEXT,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create rooms table
    await client.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id SERIAL PRIMARY KEY,
        property_id INT REFERENCES properties(id),
        room_number VARCHAR(10) NOT NULL,
        room_type TEXT,
        size INT,
        beds TEXT,
        bathroom_type TEXT,
        amenities TEXT[],
        price NUMERIC,
        status TEXT DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create reservations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        guest_name TEXT NOT NULL,
        contact_number TEXT,
        source TEXT,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        room_id INT REFERENCES rooms(id),
        status TEXT DEFAULT 'confirmed',
        total_price NUMERIC,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create menus table
    await client.query(`
      CREATE TABLE IF NOT EXISTS menus (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create menu_items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        menu_id INT REFERENCES menus(id),
        name TEXT NOT NULL,
        description TEXT,
        price NUMERIC NOT NULL,
        image_url TEXT,
        category TEXT,
        tags TEXT[],
        available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create restaurant_tables table
    await client.query(`
      CREATE TABLE IF NOT EXISTS restaurant_tables (
        id SERIAL PRIMARY KEY,
        table_number INT NOT NULL,
        seats INT NOT NULL,
        status TEXT DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_source TEXT NOT NULL,
        table_id INT REFERENCES restaurant_tables(id),
        room_id INT REFERENCES rooms(id),
        status TEXT DEFAULT 'pending',
        total_amount NUMERIC DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create order_items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(id),
        item_id INT REFERENCES menu_items(id),
        quantity INT NOT NULL,
        special_instructions TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert default admin user
    await client.query(`
      INSERT INTO users (username, password) 
      VALUES ('admin', 'admin') 
      ON CONFLICT (username) DO NOTHING;
    `);

    // Insert sample data
    await insertSampleData(client);

    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    client.release();
  }
};

const insertSampleData = async (client: any) => {
  try {
    // Insert sample property
    const propertyResult = await client.query(`
      INSERT INTO properties (name, type, rating, address) 
      VALUES ('Grand Hotel', 'Hotel', 4, '123 Main Street, City Center') 
      RETURNING id;
    `);
    const propertyId = propertyResult.rows[0].id;

    // Insert sample rooms
    await client.query(`
      INSERT INTO rooms (property_id, room_number, room_type, size, beds, price, status) 
      VALUES 
        ($1, '101', 'Deluxe', 25, 'Queen', 150.00, 'available'),
        ($1, '102', 'Standard', 20, 'Twin', 120.00, 'booked'),
        ($1, '103', 'Suite', 40, 'King', 250.00, 'available'),
        ($1, '201', 'Deluxe', 25, 'Queen', 150.00, 'available'),
        ($1, '202', 'Standard', 20, 'Twin', 120.00, 'available');
    `, [propertyId]);

    // Insert sample reservations
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    await client.query(`
      INSERT INTO reservations (guest_name, contact_number, source, check_in, check_out, room_id, total_price) 
      VALUES 
        ('John Doe', '+1234567890', 'Booking.com', $1, $2, 2, 240.00),
        ('Jane Smith', '+1987654321', 'Walk-in', $1, $2, 1, 150.00);
    `, [today, tomorrow]);

    // Insert sample menus
    const breakfastResult = await client.query(`
      INSERT INTO menus (name, description) 
      VALUES ('Breakfast Menu', 'Fresh morning delights') 
      RETURNING id;
    `);
    const lunchResult = await client.query(`
      INSERT INTO menus (name, description) 
      VALUES ('Lunch Menu', 'Hearty afternoon meals') 
      RETURNING id;
    `);

    const breakfastId = breakfastResult.rows[0].id;
    const lunchId = lunchResult.rows[0].id;

    // Insert sample menu items
    await client.query(`
      INSERT INTO menu_items (menu_id, name, description, price, category, available) 
      VALUES 
        ($1, 'Pancakes', 'Fluffy pancakes with maple syrup', 12.99, 'Main', true),
        ($1, 'Coffee', 'Fresh brewed coffee', 3.99, 'Beverage', true),
        ($2, 'Burger', 'Classic beef burger with fries', 15.99, 'Main', true),
        ($2, 'Caesar Salad', 'Fresh romaine with caesar dressing', 11.99, 'Salad', true);
    `, [breakfastId, lunchId]);

    // Insert sample restaurant tables
    await client.query(`
      INSERT INTO restaurant_tables (table_number, seats, status) 
      VALUES 
        (1, 2, 'available'),
        (2, 4, 'occupied'),
        (3, 6, 'available'),
        (4, 2, 'reserved'),
        (5, 4, 'available');
    `);

    console.log('Sample data inserted successfully!');
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
};

if (require.main === module) {
  createTables().then(() => {
    process.exit(0);
  });
}

export { createTables };