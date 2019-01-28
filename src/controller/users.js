const omit = require('lodash.omit');
const { Users } = require('../model');
const logger = require('../logger');

const createUser = ({ firstName, lastName, email, password }) =>
  Users.create({
    email,
    firstName: firstName || '',
    lastName: lastName || '',
    hash: password
  }).then(user =>
    omit(
      user.get({
        plain: true
      }),
      Users.excludeAttributes
    )
  );

const loginUser = ({ email, password }) =>
  Users.findOne({
    where: {
      email
    }
  }).then(user =>
    user && !user.deletedAt
      ? Promise.all([
          omit(
            user.get({
              plain: true
            }),
            Users.excludeAttributes
          ),
          user.comparePassword(password)
        ])
      : Promise.reject(new Error('UNKOWN OR DELETED USER'))
  );

const getUser = ({ id }) =>
  Users.findOne({
    where: {
      id
    }
  }).then(user =>
    user && !user.deletedAt
      ? omit(
          user.get({
            plain: true
          }),
          Users.excludeAttributes
        )
      : Promise.reject(new Error('UNKOWN OR DELETED USER'))
  );

const deleteUser = ({ id }) => {
    logger.info("[controller.user.delete] [IN] id : "+id)
    return Users.destroy({
        where: {id : id}}
    ).then(affectedRows => {
        affectedRows === 1 ?
        logger.info("[controller.user.delete] delete user success id : "+id) &&
        Promise.resolve("The user [id="+id+"] has been deleted") : Promise.reject(new Error('DELETE USER ERROR'));
    }).catch(err =>
        Promise(err)
    );
};

module.exports = {
  createUser,
  getUser,
  loginUser,
    deleteUser
};
