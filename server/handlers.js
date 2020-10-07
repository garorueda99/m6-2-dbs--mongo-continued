'use strict';
const assert = require('assert');
const { DBNAME } = require('./configDB');
const { MongoClient } = require('mongodb');
const { response } = require('express');
require('dotenv').config();
const { MONGO_URI } = process.env;
const options = { useNewUrlParser: true, useUnifiedTopology: true };

const getSeats = async (req, res) => {
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

//

const bookSeat = async (req, res) => {
  const { seatId, creditCard, expiration, fullName, email } = req.body;
  // if (!state) {
  //   state = {
  //     bookedSeats: randomlyBookSeats(30),
  //   };
  // }

  //delay up and running
  // await delay(Math.random() * 3000);

  if (!creditCard || !expiration) {
    return res.status(400).json({
      status: 400,
      message: 'Please provide credit card information!',
    });
  }

  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db(DBNAME);

    // await db
    //   .collection('seats')
    //   .findOne({ _id: seatId }, async (err, result) => {
    //     if (result !== null) {
    //       if (!result.isBooked) {
    //         const r = await db.collection('seats').updateOne(
    //           { _id: seatId },
    //           {
    //             $set: {
    //               isBooked: true,
    //               creditCard,
    //               expiration,
    //               fullName,
    //               email,
    //             },
    //           }
    //         );
    //         assert.strictEqual(1, r.matchedCount);
    //         assert.strictEqual(1, r.modifiedCount);
    //         client.close();
    //         return res.status(200).json({ status: 200, message: 'booked' });
    //       }
    //       res.status(409).json({ status: 403, message: 'seat taken' });
    //       client.close();
    //     } else {
    //       res.status(400).json({ status: 400, message: 'Not found' });
    //     }
    //   });

    let r = await db
      .collection('seats')
      .replaceOne(
        { _id: seatId, isBooked: false },
        { isBooked: true, creditCard, expiration, fullName, email }
      );
    assert.strictEqual(1, r.modifiedCount);
    return res
      .status(200)
      .json({ status: 200, message: 'booked', response: r.modifiedCount });
  } catch (err) {
    res.status(500).json({ status: 400, message: err.message });
  }

  // return res.status(500).json({
  //   message: 'An unknown error has occurred. Please try your request again.',
  // });
};

const clearSeat = async (req, res) => {
  const _id = req.params._id.toUpperCase();
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db(DBNAME);
    // let r = await db.collection('seats').deleteOne({ _id });
    // assert.strictEqual(1, r.deletedCount);
    // r = await db
    //   .collection('seats')
    //   .insertOne({ _id, price: 225, isBooked: false });
    // assert.strictEqual(1, r.insertedCount);
    // client.close();
    // res.status(201).json({ status: 201, message: 'seat cleared' });
    let r = await db
      .collection('seats')
      .replaceOne({ _id }, { _id, price: 225, isBooked: false });
    assert.strictEqual(1, r.modifiedCount);
    res.status(201).json({ status: 201, message: 'seat cleared' });
  } catch (err) {
    res.status(500).json({ status: 500, _id, message: err.message });
    client.close();
  }
};

// missing implementation on FE
const modifySeatInfo = async (req, res) => {
  const { _id, email, fullName } = req.body;
  const response = {};
  if (email) {
    response.email = email;
  }
  if (fullName) {
    response.fullName = fullName;
  }
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db(DBNAME);
    const r = await db.collection('seats').updateOne(
      { _id, isBooked: true },
      {
        $set: {
          ...response,
        },
      }
    );
    assert.strictEqual(1, r.matchedCount);
    assert.strictEqual(1, r.modifiedCount);
    client.close();
    res.status(201).json({ status: 201, message: 'seat has been modified' });
  } catch (err) {
    res.status(500).json({ status: 500, _id, message: err.message });
    client.close();
  }
};

const delay = (length) => new Promise((resolve) => setTimeout(resolve, length));

module.exports = { getSeats, bookSeat, clearSeat, modifySeatInfo };
