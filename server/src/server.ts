import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import reservationRoutes from './routes/reservations';
import propertyRoutes from './routes/properties';
import menuRoutes from './routes/menus';
import orderRoutes from './routes/orders';
import billingRoutes from './routes/billing';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/billing', billingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});