const express = require('express');
const router = express.Router();
const passport = require('passport');

const { v4: uuid } = require('uuid');

const { User } = require('../database/models');

function UserErrorResponse(res, statusCode, message) {
  return res.status(statusCode).json({
    statusType: 'warning',
    statusMessage: message,
  });
}

function SuccessResponse(res, statusCode, message) {
  return res.status(statusCode).json({
    statusType: 'success',
    statusMessage: message,
  });
}

function ServerErrorResponse(res) {
  return res.status(500).json({
    statusType: 'error',
    statusMessage:
      'Sorry, we cannot process your request right now.  Please try again later!',
  });
}

// GET /user: retrieve the currently logged in user
router.get('/user', (req, res) => {
  if (req.user !== undefined) {
    return res.json({ username: req.user.username });
  }

  console.log('No existing session found.');
  return res.json({});
});

// POST /login: attempt to log the client in
router.post('/login', async (req, res) => {
  try {
    passport.authenticate('local', (err, user, _) => {
      if (err) {
        next(err);
      }
      if (user === null || user === undefined) {
        console.log('User could not be found.');
        return UserErrorResponse(res, 404, 'User could not be found.');
      }
      req.login(user, async (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        return SuccessResponse(res, 200, 'Logged in successfully!');
      });
    })(req, res, next);
  } catch (err) {
    console.log(`Encountered "${err.message}" while logging user in.`);
    return ServerErrorResponse(res);
  }
});

// POST /register: Attempt to register the client
router.post('/register', async (req, res) => {
  const { username, password, confirmationPassword } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user !== null && user !== undefined) {
      console.log(`${username} already exists!`);
      return UserErrorResponse(res, 400, `${username} already exists!`);
    } else {
      // TODO: Replace comparison with a linear time comparison
      if (password !== confirmationPassword) {
        return UserErrorResponse(res, 400, 'The passwords do not match.');
      }

      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          console.log(
            `There was an issue hashing the password: ${err.message}`
          );
          return ServerErrorResponse(res);
        }

        await User.create({
          username,
          password: hash,
          userId: `U-${uuid()}`,
        });
      });

      return SuccessResponse(res, 200, 'Account created successfully!');
    }
  } catch (err) {
    return ServerErrorResponse(res);
  }
});

// POST /logout: delete the client's session
router.post('/logout', async (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
