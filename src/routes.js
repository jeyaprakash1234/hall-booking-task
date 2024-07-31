const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Room = require('./models/Room');
const Booking = require('./models/Booking');

// Create a Room
router.post('/rooms', async (req, res) => {
  const { numberOfSeats, amenities, pricePerHour } = req.body;
  const room = new Room({
    numberOfSeats,
    amenities,
    pricePerHour,
    name: `Room ${numberOfSeats}`,
  });
  try {
    const savedRoom = await room.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Book a Room
router.post('/bookings', async (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return res.status(400).json({ message: 'Invalid roomId format.' });
  }

  try {
    const existingBookings = await Booking.find({ roomId, date });
    const isRoomAvailable = !existingBookings.some(
      (booking) =>
        (startTime >= booking.startTime && startTime < booking.endTime) ||
        (endTime > booking.startTime && endTime <= booking.endTime)
    );

    if (!isRoomAvailable) {
      return res.status(400).json({ message: 'Room is booking already.' });
    }

    const booking = new Booking({
      customerName,
      date,
      startTime,
      endTime,
      roomId: new mongoose.Types.ObjectId(roomId),
      bookingDate: new Date().toISOString(),
      status: 'Booked',
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// List all Rooms with Booked Data
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find().populate('bookings');
    res.json(rooms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// List all customers with Booked Data
router.get('/customers', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('roomId');
    const customers = bookings.map((booking) => ({
      customerName: booking.customerName,
      roomName: booking.roomId.name,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    }));
    res.json(customers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// List customer bookings
router.get('/customers/:name/bookings', async (req, res) => {
  const { name } = req.params;
  try {
    const bookings = await Booking.find({ customerName: name }).populate('roomId');
    const customerBookings = bookings.map((booking) => ({
      customerName: booking.customerName,
      roomName: booking.roomId.name,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      bookingId: booking.id,
      bookingDate: booking.bookingDate,
      bookingStatus: booking.status,
    }));
    res.json(customerBookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
