import express from 'express';
import Transaction from '../models/Transaction.mjs';

const router = express.Router();

router.get('/', async (req, res) => {
  const data = await Transaction.find({});
  res.json(data);
});

export default router;