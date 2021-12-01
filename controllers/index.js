const router = require('express').Router();
const userRoutes = require('./userRoutes');
const apiRoutes = require('./api');
const homeRoutes = require('./homeRoutes');
const commentRoutes = require('./comment-routes');
const postRoutes = require('./postRoutes');

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);

module.exports = router;



