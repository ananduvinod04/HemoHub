const express = require('express');
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
   getAdminProfile,
  updateAdminProfile,
  getDashboard,
  getAllUsers,
  getAllBloodStock,
  getAllRequests,
   updateUser,
  updateBloodStock,
  updateAppointment,
  deleteUser,
  getDeleteLogs,
  restoreFromDeleteLogs,
  logoutAdmin
} = require('../controllers/adminController');

const { protectAdmin } = require('../middlewares/authMiddleware');

// Auth routes
router.post('/register', registerAdmin); // Super admin only
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
// Profile Routes
router.get('/profile', protectAdmin, getAdminProfile);
router.put('/profile', protectAdmin, updateAdminProfile);


// Protected routes
router.get('/dashboard', protectAdmin, getDashboard);
router.get('/users', protectAdmin, getAllUsers);
router.get('/stocks', protectAdmin, getAllBloodStock);
router.get('/requests', protectAdmin, getAllRequests);
router.delete('/delete/:type/:id', protectAdmin, deleteUser);
router.get('/deletelogs', protectAdmin, getDeleteLogs);
router.put('/deletelogs/:id/restore', protectAdmin, restoreFromDeleteLogs);

router.put('/update/:type/:id', protectAdmin, updateUser); // update donor, hospital, recipient


router.put('/stock/:id', protectAdmin, updateBloodStock); // edit blood stock details


router.put('/appointment/:id', protectAdmin, updateAppointment); // edit appointment (approve, cancel, reschedule)


module.exports = router;
