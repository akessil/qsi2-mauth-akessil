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
    }).then(groups => groups)
    .catch(err => {
        new Error('NO GROUP FIND FOR USER')
    })
};

const getGroup= ({ id }) =>
    Groups.findOne({
        where: {
            id
        }
    }).then(group =>
        group && !group.deletedAt
            ? group
            : Promise.reject(new Error('UNKOWN OR DELETED GROUP'))
    );

const addMemberToGroup = ({member, group}) =>{
    logger.info('[controller.groups.addMemberToGroup][IN] memberId: ' +  member.id + ', groupId:' + group.id + ', owner:');
    return member && group && member.id && group.id?
        group.addUsers(member.id)
        :Promise.reject(new Error('Can not add member, only the owner can'));
};

const deleteMemberFromGroup = ({userId, groupId}) =>
    Groups.findOne({
        where: {
            id: groupId
        }
    }).then(group => {
            return group.removeUsers(userId);
        }
    );

module.exports = {
    createGroup,
    getGroup,
    findAllByOwner,
    addMemberToGroup,
    deleteMemberFromGroup,
    getGroup
};
