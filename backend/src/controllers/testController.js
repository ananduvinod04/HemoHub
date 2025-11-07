exports.home = (req, res) => {
  res.status(200).json({
    message: 'Welcome to Blood Donation System Backend API 🚑',
  });
};
