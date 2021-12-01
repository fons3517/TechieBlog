const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all posts and JOIN with user data
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });
    console.log('Reached git')
    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));
    console.log(posts);
    // Pass serialized data and session flag into template
    res.render('homepage', {
      posts,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const post = postData.get({ plain: true });

    res.render('post', {
      ...post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  console.log("Profile", req.session.user_id)
  try {
    // Find the logged in user based on the session ID
    const userData = await Post.findAll({
      where: { user_id: req.session.user_id }
      //, attributes: { exclude: ['password'] }
    }, { raw: true }
    );
    console.log("USerdata - Profile", userData)
    // const user = userData.get({ plain: true });
    // console.log('user', user)
    res.render('profile', {
      username: req.session.username,
      email: req.session.email,
      id: req.session.user_id,
      post: [],
      logged_in: true
    });
  } catch (err) {
    console.log("Err", err)
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  try {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    }
  } catch (err) {
    console.log("Err", err);
    res.status(500).json(err);
  }
  res.render('login');
});

router.get('/', (req, res) => {
  try {
    // If the user is already logged in, redirect the request to another route
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    }

  } catch (err) {
    console.log("Err", err);
    res.status(500).json(err);
  }
  res.render('homepage');
});

module.exports = router;
