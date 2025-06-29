// import fs from 'fs';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import Transaction from './models/Transaction.mjs';

// dotenv.config();

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }).then(() => console.log('MongoDB Connected'));

// const data = JSON.parse(fs.readFileSync('./data/transactions.json', 'utf-8'));

// async function importData() {
//   try {
//     await Transaction.insertMany(data);
//     console.log('JSON data successfully imported into MongoDB.');
//   } catch (err) {
//     console.error('Error importing JSON:', err);
//   } finally {
//     process.exit();
//   }
// }

// importData();




// backend/importJSON.mjs
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transaction from './models/Transaction.mjs';

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const data = JSON.parse(fs.readFileSync('./data/transactions.json', 'utf-8'));

async function importData() {
  try {
    await Transaction.deleteMany(); // optional: clear existing
    await Transaction.insertMany(data);
    console.log('✅ Data imported to MongoDB');
  } catch (err) {
    console.error('❌ Import failed:', err);
  } finally {
    process.exit();
  }
}
importData();
