const router = require('express').Router();
const userRoutes = require('./userRoutes');
const commentRoutes = require('./comment-routes');
const postRoutes = require('./postRoutes');


router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;