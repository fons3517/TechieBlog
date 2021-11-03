const router = require('express').Router();
const userRoutes = require('./userRoutes');
const postRoutes = require('./postRoutes');
const homeRoutes = require('../homeRoutes');

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('../homeRoutes', homeRoutes);

module.exports = router;
