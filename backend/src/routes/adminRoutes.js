const express = require('express');
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  getDashboard,
  getAllUsers,

  // Blood stock
  getAllBloodStock,
  updateBloodStock,

  // Recipient requests
  getAllRequests,
  updateRecipientRequestStatus,
  deleteRecipientRequest,        

  // Donor appointments
  getAllAppointments,
  updateAppointment,
  deleteAppointment,           

  // Users
  updateUser,
  deleteUser,

  // Delete logs
  getDeleteLogs,
  restoreFromDeleteLogs,

  // Auth
  logoutAdmin
} = require('../controllers/adminController');

const { protectAdmin } = require('../middlewares/authMiddleware');


// Auth Routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);


// Admin Profile
router.get('/profile', protectAdmin, getAdminProfile);
router.put('/profile', protectAdmin, updateAdminProfile);


// Dashboard & Users
router.get('/dashboard', protectAdmin, getDashboard);
router.get('/users', protectAdmin, getAllUsers);
router.put('/update/:type/:id', protectAdmin, updateUser);


// Blood Stock
router.get('/stocks', protectAdmin, getAllBloodStock);
router.put('/stock/:id', protectAdmin, updateBloodStock);


// Recipient Requests
router.get('/requests', protectAdmin, getAllRequests);

router.put(
  '/requests/:id/status',
  protectAdmin,
  updateRecipientRequestStatus
);

// Delete recipient request (ADMIN)
router.delete(
  '/requests/:id',
  protectAdmin,
  deleteRecipientRequest
);


// Donor Appointments
router.get(
  '/appointments',
  protectAdmin,
  getAllAppointments
);

router.put(
  '/appointment/:id',
  protectAdmin,
  updateAppointment
);

// Delete donor appointment (ADMIN)
router.delete(
  '/appointment/:id',
  protectAdmin,
  deleteAppointment
);


// Delete / Restore Users
router.delete('/delete/:type/:id', protectAdmin, deleteUser);
router.get('/deletelogs', protectAdmin, getDeleteLogs);
router.put('/deletelogs/:id/restore', protectAdmin, restoreFromDeleteLogs);


module.exports = router;
