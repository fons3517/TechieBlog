const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', async (req, res) => {
  console.log(req.body, "get")
  try {
    await Post.findAll({
      where: {
        attributes: ['id', 'title', 'post_text', 'date_created'],
        order: [['created_at', 'DESC']],
        include: [
          {
            model: User,
            attributes: ['username'],
          },
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'date_created'],
            include: {
              model: User,
              attributes: ['username']
            }
          }
        ]
      }
    });
    res.status(200).json(dbPostData);
  } catch (err) {
    console.log("Error", err)
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  console.log(req.body, "get")
  try {
    await Post.findOne({
      where: {
        id: req.params.id,
      }, attributes: ['id', 'title', 'post_text', 'date_created'],
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'date_created'],
          include: {
            model: User,
            attributes: ['username']
          }
        }
      ]
    });
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    }
    res.status(200).json(dbPostData);
  } catch (err) {
    console.log("Error", err)
    res.status(500).json(err);
  }
});


router.post('/', withAuth, async (req, res) => {
  console.log(req.body, "post")
  try {
    const newPost = await Post.create({
      title: req.body.title,
      body: req.body.post_text,
      user_id: req.session.user_id,
    });
    res.status(200).json(newPost);
    if (!newPost) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    };
  } catch (err) {
    console.log("Error", err)
    res.status(500).json(err);
  }
});

router.put('/:id', withAuth, async (req, res) => {
  try {
    const newPost = await Post.update(
      {
        title: req.body.title,
        post_text: req.body.post_text
      },
      {
        where: {
          id: req.params.id,
        }
      }
    )
    if (!newPost) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    };
    res.status(200).json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });
    if (!postData) {
      res.status(404).json({ message: 'No post found with this id!' });
      return;
    };
    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
