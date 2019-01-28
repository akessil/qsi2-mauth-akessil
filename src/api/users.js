const express = require('express');
const jwt = require('jwt-simple');
const { createUser, loginUser, deleteUser } = require('../controller/users');
const logger = require('../logger');

const apiUsers = express.Router();

// http://apidocjs.com/#params
/**
 * @api {post} /users User account creation
 * @apiVersion 1.0.0
 * @apiName createUser
 * @apiGroup Users
 *
 * @apiParam {STRING} email Email of the User.
 * @apiParam {STRING} password  Password of the User.
 * @apiParam {STRING} [firstName] First name of the User.
 * @apiParam {STRING} [lastName] Last name of the User.
 *
 * @apiSuccess {BOOLEAN} success Success.
 * @apiSuccess {STRING} message Message.
 * @apiSuccess {STRING} token JWT token.
 * @apiSuccess {JSON} profile Profile informations about the User.
 */
apiUsers.post('/', (req, res) =>
  !req.body.email || !req.body.password
    ? res.status(400).send({
        success: false,
        message: 'email and password are required'
      })
    : createUser(req.body)
        .then(user => {
          const token = jwt.encode({ id: user.id }, process.env.JWT_SECRET);
          return res.status(201).send({
            success: true,
            token: `JWT ${token}`,
            profile: user,
            message: 'user created'
          });
        })
        .catch(err => {
          logger.error(`💥 Failed to create user : ${err.stack}`);
          return res.status(500).send({
            success: false,
            message: `${err.name} : ${err.message}`
          });
        })
);

/**
 * @api {post} /users/login User login
 * @apiVersion 1.0.0
 * @apiName loginUser
 * @apiGroup Users
 *
 * @apiParam {STRING} email Email of the User.
 * @apiParam {STRING} password  Password of the User.
 *
 * @apiSuccess {BOOLEAN} success Success.
 * @apiSuccess {STRING} message Message.
 * @apiSuccess {STRING} token JWT token.
 * @apiSuccess {JSON} profile Profile informations about the User.
 */
apiUsers.post('/login', (req, res) =>
  !req.body.email || !req.body.password
    ? res.status(400).send({
        success: false,
        message: 'email and password are required'
      })
    : loginUser(req.body)
        .then(user => {
          const token = jwt.encode({ id: user.id }, process.env.JWT_SECRET);
          return res.status(200).send({
            success: true,
            token: `JWT ${token}`,
            profile: user,
            message: 'user logged in'
          });
        })
        .catch(err => {
          logger.error(`💥 Failed to login user : ${err.stack}`);
          return res.status(500).send({
            success: false,
            message: `${err.name} : ${err.message}`
          });
        })
);

const apiUsersProtected = express.Router();
apiUsersProtected.get('/', (req, res) =>
  res.status(200).send({
    success: true,
    profile: req.user,
    message: 'user logged in'
  })
);

apiUsersProtected.delete('/delete', (req, res) =>
    !req.user
        ? res.status(400).send({
            success: false,
            message: 'You must login to delete your account'
        })
        : deleteUser({id: req.user.id})
            .then(user => {
                return res.status(200).send({
                    success: true,
                    profile: user,
                    message: 'delete sucess'
                });
            })
            .catch(err => {
                logger.error(`💥 Failed to delete user : ${err.stack}`);
                return res.status(500).send({
                    success: false,
                    message: `${err.name} : ${err.message}`
                });
            })
);

module.exports = { apiUsers, apiUsersProtected };
