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

const addMemberToGroup = ({member, groupId,owner}) =>{
    logger.info('[controller.groups.addMemberToGroup][IN] memberId: ' +  member.id + ', groupId:' + groupId + ', owner:' + owner.id);
    return member && owner && owner.id ?
        getGroup({id: groupId})
            .then( group =>{
                logger.info('Group found: ' + group);
                return group.addUsers(member.id);
            })
            .catch(err => Promise.reject(err))
        :Promise.reject(new Error('Can not add member'))
};

module.exports = {
    createGroup,
    getGroup,
    findAllByOwner,
    addMemberToGroup
};
