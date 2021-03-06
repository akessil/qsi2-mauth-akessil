const express = require('express');
const { createGroup, findAllByOwner, addMemberToGroup,getGroup, deleteMemberFromGroup } = require('../controller/groups');
const { getUser } = require('../controller/users');
const logger = require('../logger');

const apiGroupsProtected = express.Router();

// http://apidocjs.com/#params
/**
 * @api {post} /groups Group creation
 * @apiVersion 1.0.0
 * @apiName createGroup
 * @apiGroup Users
 *
 * @apiParam {STRING} title Title of the group.
 * @apiParam {STRING} description  Description of the group.
 *
 * @apiSuccess {BOOLEAN} success Success.
 * @apiSuccess {STRING} message Message.
 * @apiSuccess {JSON} group Group information and metadatas (owner and members).
 */
apiGroupsProtected.post('/', (req, res) =>
    !req.body.title
        ? res.status(400).send({
            success: false,
            message: 'Title is required'
        })
        : createGroup({title: req.body.title, description: req.body.description, owner: req.user})
            .then(group => {
                return res.status(201).send({
                    success: true,
                    group: group,
                    message: 'group created'
                });
            })
            .catch(err => {
                logger.error(`💥 Failed to create group : ${err.stack}`);
                return res.status(500).send({
                    success: false,
                    message: `${err.name} : ${err.message}`
                });
            })
);

apiGroupsProtected.get('/owner/all', (req, res) => {
    logger.info('get all groups ownerId:' + req.user.id);
    findAllByOwner(req.user.id).then(groups =>{
        return res.status(200).send({
            success: true,
            groups: groups,
            message: "my owen groups"
        })
    }).catch(err => {
        logger.error(err.stack);
        return err;
    })
});

apiGroupsProtected.put('/owner/addMember', (req, res) => {
        logger.info('[api.groups.addMember][IN]: groupId:' + req.body.groupId + ', memberId: ' + req.body.memberId);
        return (!req.body.groupId && !req.body.memberId)
            ? res.status(400).send({
                success: false,
                message: 'GroupId and memberId are required'
            })
            : getUser({id: req.body.memberId}).then(member =>
                getGroup({id: req.body.groupId})
                    .then( group =>{
                        logger.info('Group found: ' + group);
                        return req.user.id === group.ownerId ? addMemberToGroup({member, group}):Promise(new Error('Only Owner can add member' ))})
                .then(group => {
                    return res.status(201).send({
                        success: true,
                        group: group,
                        message: 'Add member to group success'
                    });
                })
                .catch(err => {
                    logger.error(`💥 Failed to add member to the group : ${err.stack}`);
                    return res.status(500).send({
                        success: false,
                        message: `${err.name} : ${err.message}`
                    });
                })
            )
        });

apiGroupsProtected.put('/owner/deleteMember', (req, res) => {
    logger.info('[api.groups.deleteMember][IN]: groupId:' + req.body.groupId + ', memberId: ' + req.body.memberId);
    return (!req.body.groupId && !req.body.memberId)
        ? res.status(400).send({
            success: false,
            message: 'GroupId and memberId are required'
        })
        : getGroup({id: req.body.groupId}).then(group =>
            req.user.id === group.ownerId ?
                deleteMemberFromGroup({
                    userId: req.body.memberId,
                    groupId: req.body.groupId,
                }) : Promise.reject(new Error('Can not delete member, owner only can')))
            .then(group => {
                return res.status(201).send({
                    success: true,
                    group: group,
                    message: 'Delete member from group success'
                });
            })
            .catch(err => {
                logger.error(`💥 Failed to delete member from the group : ${err.stack}`);
                return res.status(500).send({
                    success: false,
                    message: `${err.name} : ${err.message}`
                });
            })
        }
    );

apiGroupsProtected.put('/member', (req, res) => {
        logger.info('[api.groups.subscribe][IN]: groupId:' + req.body.groupId );
        return (!req.body.groupId)
            ? res.status(400).send({
                success: false,
                message: 'GroupId is required'
            })
            : getGroup({id: req.body.groupId}).then(group =>
                group ?
                    addMemberToGroup({member: req.user, group}) : Promise.reject(new Error('Can not delete member, owner only can')))
                .then(group => {
                    return res.status(201).send({
                        success: true,
                        group: group,
                        message: 'Subscribe member to group success'
                    });
                })
                .catch(err => {
                    logger.error(`💥 Failed to subscribe the group : ${err.stack}`);
                    return res.status(500).send({
                        success: false,
                        message: `${err.name} : ${err.message}`
                    });
                })
    });


apiGroupsProtected.delete('/member', (req, res) => {
    logger.info('[api.groups.unsubscribe][IN]: groupId:' + req.body.groupId );
    return (!req.body.groupId)
        ? res.status(400).send({
            success: false,
            message: 'GroupId is required'
        })
        : getGroup({id: req.body.groupId}).then(group =>
            group ?
                deleteMemberFromGroup({userId: req.user.id, groupId: group.id}) : Promise.reject(new Error('Group Not Found')))
            .then(group => {
                return res.status(201).send({
                    success: true,
                    group: group,
                    message: 'Unsubscribe member from group success'
                });
            })
            .catch(err => {
                logger.error(`💥 Failed to subscribe the group : ${err.stack}`);
                return res.status(500).send({
                    success: false,
                    message: `${err.name} : ${err.message}`
                });
            })
    });


module.exports = { apiGroupsProtected };
