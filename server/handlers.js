'use strict';

const getSeats = async (req, res) => {
  const { DBNAME } = require('./configDB');
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

const postPurchase = async (req, res) => {
  const { seatId, creditCard, expiration } = req.body;

  if (!state) {
    state = {
      bookedSeats: randomlyBookSeats(30),
    };
  }

  await delay(Math.random() * 3000);

  const isAlreadyBooked = !!state.bookedSeats[seatId];
  if (isAlreadyBooked) {
    return res.status(400).json({
      message: 'This seat has already been booked!',
    });
  }

  if (!creditCard || !expiration) {
    return res.status(400).json({
      status: 400,
      message: 'Please provide credit card information!',
    });
  }

  if (lastBookingAttemptSucceeded) {
    lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;

    return res.status(500).json({
      message: 'An unknown error has occurred. Please try your request again.',
    });
  }

  lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;

  state.bookedSeats[seatId] = true;

  return res.status(200).json({
    status: 200,
    success: true,
  });
};

module.exports = { getSeats, postPurchase };
