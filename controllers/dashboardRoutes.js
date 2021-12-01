const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {
    await Post.findAll({
      where: {
        user_id: req.session.user_id,
      },
      attributes: ['id', 'title', 'post_text', 'date_created'],
      order: [['date_created', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'date_created'],
          include: {
            model: User,
            attributes: ['username'],
          }
        }
      ]
    });
    res.status(200).json(dbPostData);
    if (!dbPostData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    await Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ['id', 'title', 'post_text', 'date_created'],
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'date_created'],
          include: {
            model: User,
            attributes: ['username'],
          }
        }
      ]
    });
    res.status(200).json(dbPostData);
    if (!dbPostData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }
    const post = dbPostData.get({ plain: true });
    res.render('edit-post', {
      post,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/new', (req, res) => {
  try {
    res.render('add-post', {
      loggedIn: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
