const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['patient', 'dentist'], default: 'patient' }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Dentist Schema
const dentistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  specialization: String,
  availability: [String], // Example: ['Monday', 'Wednesday', 'Friday']
});

const Dentist = mongoose.model('Dentist', dentistSchema);

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Add patientId
  patientName: String,
  patientEmail: String,
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dentist', required: true },
  doctorName: String,
  date: String,
  time: String,
  message: String,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// Helper: JWT Generator
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Middleware
const doctorMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (user && user.role === 'dentist') {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: 'Access denied: Not a dentist' });
      }
    } catch (error) {
      return res.status(401).json({ message: 'Token failed or expired' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

const patientMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (user && user.role === 'patient') {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: 'Access denied: Not a patient' });
      }
    } catch (error) {
      return res.status(401).json({ message: 'Token failed or expired' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

// Routes
app.post('/api/checkups/request', patientMiddleware, async (req, res) => {
  res.json({ message: 'Checkup request submitted (for patients only)' });
});

app.post('/api/checkups/upload', doctorMiddleware, async (req, res) => {
  res.json({ message: 'Upload successful (for dentists only)' });
});

// Register
app.post('/api/users/register', async (req, res) => {
  const { name, email, password, role, specialization, availability } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role });

    if (role === 'dentist') {
      await Dentist.create({
userId:user._id,
        name,
        specialization,
        availability,
      });
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Available Dentists
app.get('/api/dentists', patientMiddleware, async (req, res) => {
  try {
    const dentists = await Dentist.find({});
    res.json(dentists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create an Appointment
app.post('/api/appointments', patientMiddleware, async (req, res) => {
  const { patientName, patientEmail, doctorId, doctorName, date, time, message } = req.body;
  try {
    const appointment = await Appointment.create({
      patientId: req.user._id, // Set patientId from authenticated user
      patientName,
      patientEmail,
      doctorId,
      doctorName,
      date,
      time,
      message,
    });
    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Appointments for a Doctor
app.get('/api/appointments/doctor/:doctorId', doctorMiddleware, async (req, res) => {
  try {
    const doctorUserId = req.params.doctorId;
    // Step 1: Find dentist with matching userId
    const dentist = await Dentist.findOne({ userId: doctorUserId });
    if (!dentist) {
      return res.status(404).json({ message: 'Dentist profile not found' });
    }

    // Step 2: Find appointments using the dentist._id
    const appointments = await Appointment.find({ doctorId: dentist._id });
    
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get Appointments for a Patient
app.get('/api/appointments/patient/:patientId', patientMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.patientId });

    if (req.user._id.toString() !== req.params.patientId) {
      return res.status(403).json({ message: 'Access denied: You can only view your own appointments' });
    }
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));