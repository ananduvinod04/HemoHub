const express = require('express');
const router = express.Router();
const {
  registerDonor,
  loginDonor,
  getProfile,
  updateProfile,
  bookAppointment,
  deleteAppointment,
  getAppointmentHistory,
  getDashboard,
  deleteDonor,
} = require('../controllers/donorController');
const{getHospitalList}=require('../controllers/hospitalController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerDonor);
router.post('/login', loginDonor);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/appointment', protect, bookAppointment);
router.delete('/appointment/:id', protect, deleteAppointment);
router.get('/appointments/history', protect, getAppointmentHistory);

router.get('/dashboard', protect, getDashboard);
router.delete('/delete', protect, deleteDonor);
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

router.get('/hospitals', protect, getHospitalList);

module.exports = router;
