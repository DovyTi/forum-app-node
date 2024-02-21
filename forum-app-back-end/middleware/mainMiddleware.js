const resSend = require('../plugins/resSend');
const jwt = require('jsonwebtoken');
const userSchema = require('../schemas/userSchema');

module.exports = {
  registerValidate: (req, res, next) => {
    const { username, passwordOne, passwordTwo, role } = req.body;

    if (role !== 'admin' && role !== 'user')
      return resSend(res, false, null, 'Bad role name.');
    if (username.length < 4 || username.length > 20)
      return resSend(res, false, null, 'Username length bad.');

    if (passwordOne !== passwordTwo)
      return resSend(res, false, null, 'Passwords should match.');

    if (passwordOne.length < 4 || passwordOne.length > 20)
      return resSend(res, false, null, 'Passwords length bad.');

    function containsUppercase(str) {
      return /[A-Z]/.test(str);
    }

    if (!containsUppercase(passwordTwo))
      return resSend(
        res,
        false,
        null,
        'Password has to be with one upper case letter'
      );

    function hasNumber(str) {
      return /\d/.test(str);
    }

    if (!hasNumber(passwordOne))
      return resSend(
        res,
        false,
        null,
        'Password should contain at least one numeric symbol'
      );

    console.log(req.body);
    next();
  },

  loginValidate: (req, res, next) => {
    const { username, password } = req.body;
    if (username.length < 4 || username.length > 20)
      return resSend(res, false, null, 'Username length bad.');
    if (password.length < 4 || password.length > 20)
      return resSend(res, false, null, 'Passwords length bad.');
    next();
  },

  tokenAuth: (req, res, next) => {
    const token = req.headers.authorization;

    jwt.verify(token, process.env.JWT_SECRET, (err, item) => {
      if (err) return resSend(res, false, null, 'Invalid Token.');

      req.body.username = item.username;

      next();
    });
  },
  adminValidate: async (req, res, next) => {
    const { username } = req.body;

    const user = await userSchema.findOne({ username });

    if (user.role !== 'admin') return resSend(res, false, null, 'bad role');

    next();
  },
};
