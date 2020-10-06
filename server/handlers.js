'use strict';

const getSeats = async (req, res) => {
  const { DBNAME } = require('../configDB');
  const { MongoClient } = require('mongodb');
  require('dotenv').config();
  const { MONGO_URI } = process.env;
  const options = { useNewUrlParser: true, useUnifiedTopology: true };
  const { start = 0, limit = 96 } = req.query;
  const [startInt, limitInt] = Object.values({ start, limit }).map(Number);

  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(DBNAME);

    db.collection('seats')
      .find()
      .toArray((err, result) => {
        if (result.length) {
          const init =
            startInt < 0
              ? 0
              : startInt > result.length
              ? result.length
              : startInt;
          const end =
            startInt + limitInt > result.length
              ? result.length
              : startInt + limitInt;
          res.status(200).json({
            status: 200,
            start: init,
            limit: end - init,
            data: result.slice(init, end),
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
