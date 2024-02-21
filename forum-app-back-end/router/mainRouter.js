const express = require('express');
const router = express.Router();

const {
  registerUser,
  login,
  updateImage,
  createPost,
  deletePost,
  getAll,
  search,
  makeComment,
  createMainTopic,
  deleteMainTopic,
  getAllTopic,
  getMainTopic,
  createDiscussion,
  getAllDiscussion,
  getDiscussion,
} = require('../controller/mainController');
const {
  registerValidate,
  loginValidate,
  tokenAuth,
  adminValidate,
} = require('../middleware/mainMiddleware');

router.post('/register', registerValidate, registerUser);
router.post('/login', loginValidate, login);
router.post('/updateImage', tokenAuth, updateImage);
router.post('/create', createPost);
router.post('/createMainTopic', tokenAuth, adminValidate, createMainTopic);
router.post('/createDiscussion', createDiscussion);

router.get('/getAll', getAll);
router.get('/deletePost/:id', deletePost);
router.get('/deleteMainTopic/:id', deleteMainTopic);
router.get('/getAllTopic', getAllTopic);
router.get('/getAllDiscussion', getAllDiscussion);
router.get('/forum/:id', getMainTopic);
router.get('topic/:id', getDiscussion);

router.post('/search', search);
router.post('/makeComment', tokenAuth, makeComment);

module.exports = router;
