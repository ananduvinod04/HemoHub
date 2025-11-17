const express = require('express');
const router = express.Router();
const {
  registerHospital,
  loginHospital,
  getProfile,
  updateProfile,
  addBloodStock,
  getBloodStock,
  updateBloodStock,
  deleteBloodStock,
  getAppointments,
  updateAppointmentStatus,
  getRecipientRequests,
  updateRequestStatus,
  logoutHospital
  
} = require('../controllers/hospitalController');
const { protectHospital} = require('../middlewares/authMiddleware');

// Authentication
router.post('/register', registerHospital);
router.post('/login', loginHospital);

// Profile
router.get('/profile', protectHospital, getProfile);
router.put('/profile', protectHospital, updateProfile);

// Blood Stock
router.post('/stock', protectHospital, addBloodStock);
router.get('/stock', protectHospital, getBloodStock);
router.put('/stock/:id', protectHospital, updateBloodStock);
router.delete('/stock/:id', protectHospital, deleteBloodStock);

// Appointments
router.get('/appointments', protectHospital, getAppointments);
router.put('/appointments/:id/status', protectHospital, updateAppointmentStatus);

// Recipient Requests
router.get('/requests', protectHospital, getRecipientRequests);
router.put('/requests/:id/status', protectHospital, updateRequestStatus);
router.post('/logout', logoutHospital);



module.exports = router;
