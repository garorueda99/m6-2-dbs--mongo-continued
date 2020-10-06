'use strict';

const getSeats = async (req, res) => {
  const { DBNAME } = require('./configDB');
  const { MongoClient } = require('mongodb');
  require('dotenv').config();
  const { MONGO_URI } = process.env;
  const options = { useNewUrlParser: true, useUnifiedTopology: true };
  const { start = 0, limit = 96 } = req.query;
  const [startInt, limitInt] = Object.values({ start, limit }).map(Number);

  let state;

  // if (!state) {
  //   state = {
  //     bookedSeats: randomlyBookSeats(30),
  //   };
  // }

  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(DBNAME);

    db.collection('seats')
      .find()
      .toArray((err, result) => {
        if (result.length) {
          res.status(200).json({
            seats: result,
            bookedSeats: [],
            numOfRows: 8,
            seatsPerRow: 12,
          });
          client.close();
        } else {
          res.status(500).json({ status: 400, message: 'Not found' });
        }
      });
  } catch (err) {
    res.status(500).json({ status: 400, message: err.message });
  }
};

module.exports = { getSeats };
