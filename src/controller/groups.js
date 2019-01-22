const omit = require('lodash.omit');
const { Groups } = require('../model/');
const logger = require('../logger');

const createGroup = ({ title, description, owner}) =>
    Groups.create({
        title,
        description: description || '',
        ownerId: owner.id,
    });

const findAllByOwner = ownerId =>{
    logger.info('[GroupController] get all groups ownerId:' + ownerId);
    return Groups.findAll({
        where: {
            ownerId
        }
    }).then(groups => groups
        /*groups.forEach((group) => {
            group && !group.deletedAt
                ? Promise.all([
                    omit(
                        group.get({
                            plain: true
                        })
                    )
                ])
                : Promise.reject(new Error('NO GROUP FIND FOR USER'))
        }
    )*/
)};

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
