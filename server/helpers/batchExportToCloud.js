const assert = require('assert');
const { DBNAME } = require('../configDB');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const { MONGO_URI } = process.env;
const options = { useNewUrlParser: true, useUnifiedTopology: true };

const seats = [];
const row = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
for (let r = 0; r < row.length; r++) {
  for (let s = 1; s < 13; s++) {
    seats.push({
      _id: `${row[r]}-${s}`,
      price: 225,
      isBooked: false,
    });
  }
}

async function batchExportToCloud() {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(DBNAME);

    const r = await db.collection('seats').insertMany(seats);
    // assert won't be executed since insert many validates data a throw an error before
    console.log('===>', r.insertedCount, seats.length);
    assert.strictEqual(seats.length, r.insertedCount);
  } catch (err) {
    console.log({ status: 500, data: seats, message: err.message });
  }
}

batchExportToCloud();
