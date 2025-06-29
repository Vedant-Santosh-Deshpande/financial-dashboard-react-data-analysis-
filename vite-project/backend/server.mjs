// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';
// import transactionRoutes from './routes/transactions.mjs';
// import Transaction from './models/Transaction.mjs';

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Optional: EJS view engine (only if you want to render HTML from backend)
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // Routes
// app.use('/api/transactions', transactionRoutes);
// app.use("/api/auth", authRoutes);

// // Optional: Render transaction table from EJS template
// app.get('/transactions-view', async (req, res) => {
//   try {
//     const transactions = await Transaction.find({}).limit(100);
//     res.render('transactions', { transactions });
//   } catch (err) {
//     res.status(500).send('Error loading transactions');
//   }
// });

// // DB Connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => {
//   console.log('MongoDB connected');
//   // Start server only after DB is connected
//   app.listen(5000, () => {
//     console.log('Server running on port 5000');
//   });
// }).catch(err => {
//   console.error('MongoDB connection error:', err);
// });


import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import transactionRoutes from './routes/transactions.mjs';
import authRoutes from './routes/authRoutes.js';
import Transaction from './models/Transaction.mjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Optional: EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// JWT auth middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}

// Routes
app.use("/api/auth", authRoutes);

// Protect your transactions route:
app.use("/api/transactions", authMiddleware, transactionRoutes);

// Optional: Render transaction table from EJS template
app.get('/transactions-view', async (req, res) => {
  try {
    const transactions = await Transaction.find({}).limit(100);
    res.render('transactions', { transactions });
  } catch (err) {
    res.status(500).send('Error loading transactions');
  }
});

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(5000, () => {
    console.log('Server running on port 5000');
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});
