const omit = require('lodash.omit');
const { Groups } = require('../model/');

const createGroup = ({ title, description, owner}) =>
    Groups.create({
        title,
        description: description || '',
        metadatas: {
            ownerId: owner.id,
        },
    });

const findAllByOwner = ({ ownerId }) =>
    Groups.findAll({
        where: {
            ownerId
        }
    }).then(group =>
        user && !user.deletedAt
            ? Promise.all([
                omit(
                    user.get({
                        plain: true
                    }),
                ),
            ])
            : Promise.reject(new Error('NO GROUP FIND FOR USER'))
    );

const getGroup= ({ id }) =>
    Groups.findOne({
        where: {
            id
        }
    }).then(user =>
        user && !user.deletedAt
            ? omit(
            group.get({
                plain: true
            }),
            )
            : Promise.reject(new Error('UNKOWN OR DELETED GROUP'))
    );

module.exports = {
    createGroup,
    getGroup,
    findAllByOwner,
};
