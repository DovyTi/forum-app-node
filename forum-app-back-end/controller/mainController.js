const resSend = require('../plugins/resSend');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userSchema = require('../schemas/userSchema');
const postSchema = require('../schemas/postSchema');
const mainTopicSchema = require('../schemas/mainTopicSchema');
const discussionSchema = require('../schemas/discussionSchema');

module.exports = {
  registerUser: async (req, res) => {
    try {
      const { username, passwordOne, role } = req.body;

      const userExist = await userSchema.findOne({ username });

      if (userExist)
        resSend(res, false, null, 'This  username is already taken!');

      const password = await bcrypt.hash(passwordOne, 10);

      const newUser = new userSchema({
        username,
        password,
        image:
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        role,
      });

      await newUser.save();

      resSend(res, true, null, 'User registered successfully');
    } catch (error) {
      console.error(error);
      resSend(res, false, null, 'Error registering user');
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await userSchema.findOne({ username });

      if (!user)
        return resSend(
          res,
          false,
          null,
          'Sorry, your username was incorrect or not registered.'
        );

      const passwordGood = await bcrypt.compare(password, user.password);

      if (!passwordGood)
        return resSend(res, false, null, 'Sorry, your password was incorrect.');

      const token = jwt.sign({ username }, process.env.JWT_SECRET);

      return resSend(
        res,
        true,
        { token, username, image: user.image, role: user.role },
        'Login successful'
      );
    } catch (error) {
      console.error(error);
      resSend(res, false, null, 'Error during login');
    }
  },

  updateImage: async (req, res) => {
    try {
      const { image, username } = req.body;

      /// UPDATE USER OBJECT AND RETURN UPDATED VALUE

      const updatedUser = await userSchema.findOneAndUpdate(
        { username },
        { $set: { image } },
        { new: true }
      );
      return resSend(
        res,
        true,
        { username, image: updatedUser.image },
        'Image updated successfully'
      );
    } catch (error) {
      console.error(error);
      resSend(res, false, null, 'Error updating image');
    }
  },
  createPost: async (req, res) => {
    const { title, image } = req.body;
    console.log(req.body);

    const post = new postSchema({
      title,
      image,
    });

    await post.save();

    const allPosts = await postSchema.find();
    return resSend(res, true, { posts: allPosts }, null);
  },

  createMainTopic: async (req, res) => {
    const { title } = req.body;
    console.log(req.body);

    const mainTopic = new mainTopicSchema({
      title,
    });
    await mainTopic.save();

    const allMainTopic = await mainTopicSchema.find();
    return resSend(res, true, { mainTopics: allMainTopic }, null);
  },
  createDiscussion: async (req, res) => {
    const { title } = req.body;
    console.log(req.body);

    const discussion = new discussionSchema({
      title,
    });
    await discussion.save();

    const discussions = await discussionSchema.find();
    return resSend(res, true, { discussion: discussions }, null);
  },

  getAllTopic: async (req, res) => {
    const allMainTopics = await mainTopicSchema.find();
    return resSend(res, true, { mainTopics: allMainTopics }, null);
  },
  getAllDiscussion: async (req, res) => {
    const allDiscussions = await discussionSchema.find();
    return resSend(res, true, { discussions: allDiscussions }, null);
  },

  getAll: async (req, res) => {
    const allPosts = await postSchema.find();
    return resSend(res, true, { posts: allPosts }, null);
  },
  deletePost: async (req, res) => {
    const { id } = req.params;

    await postSchema.findOneAndDelete({ _id: id });

    const allPosts = await postSchema.find();

    return resSend(res, true, { posts: allPosts }, null);
  },

  deleteMainTopic: async (req, res) => {
    const { id } = req.params;

    await mainTopicSchema.findOneAndDelete({ _id: id });

    const allMainTopic = await mainTopicSchema.find();

    return resSend(res, true, { mainTopics: allMainTopic }, null);
  },
  search: async (req, res) => {
    const { searchPhrase } = req.body;

    const allPosts = await postSchema.find({ title: { $regex: searchPhrase } });
    return resSend(res, true, { posts: allPosts }, null);
  },
  makeComment: async (req, res) => {
    const { username, comment, id } = req.body;

    const commentMade = {
      time: Date.now(),
      comment,
      username,
    };

    const post = await postSchema.findOneAndUpdate(
      { _id: id },
      { $push: { comments: commentMade } },
      { new: true }
    );

    return resSend(res, true, { post }, null);
  },
  getMainTopic: async (req, res) => {
    const { id } = req.params;
    const allMainTopic = await mainTopicSchema.findOne({ _id: id });

    return resSend(res, true, { allMainTopic }, 'all good');
  },
  getDiscussion: async (req, res) => {
    const { id } = req.params;
    const discussion = await discussionSchema.findOne({ _id: id });

    return resSend(res, true, { discussion }, 'all good');
  },
};
