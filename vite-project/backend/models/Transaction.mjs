import mongoose from 'mongoose';
const transactionSchema = new mongoose.Schema({
  id: Number,
  date: String,
  amount: Number,
  category: String,
  status: String,
  user_id: String
});
export default mongoose.model('Transaction', transactionSchema);